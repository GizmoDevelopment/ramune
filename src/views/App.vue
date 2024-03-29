<template>
	
	<Meta />
	<Header />

	<!-- Main View -->
	<div class="app-content-container">
		<div class="route-content">
			<router-view v-slot="{ Component }">
				<transition name="view" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</div>
	</div>

	<!-- Global Room Components -->
	<div v-if="room" class="room-popout-container">
		<Draggable start-position="bottomLeft">
			<transition name="popout-slide" mode="out-in">
				<RoomPopout
					v-if="!isViewingRoom"
					:room="room"
				/>
			</transition>
		</Draggable>
	</div>
	<div v-if="room">
		<RoomController :room="room" />
	</div>

	<!-- Favicon Renderer -->
	<canvas
		ref="faviconCanvas"
		class="favicon-canvas"
		width="32"
		height="32"
	/>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, ref } from "vue";
	import { getAuthenticatedUser } from "gizmo-api";

	// Mixins
	import MainMixin from "@mixins/Main";
	import SocketMixin from "@mixins/Socket";
	import MainMethodsMixin from "@mixins/MainMethods";

	// Local Components
	import Header from "@components/Header.vue";
	import RoomController from "@components/room/RoomController.vue";
	import RoomPopout from "@components/room/RoomPopout.vue";
	import Draggable from "@components/Draggable.vue";
	import Meta from "@components/Meta.vue";

	// Utils
	import { getCookie } from "@utils/dom";

	// Types
	import type { AuthenticatedUser, User } from "gizmo-api";
	import type { Room, RoomData } from "@typings/room";
	import type { Flavor } from "@typings/settings";

	export default defineComponent({
		name: "App",
		components: {
			Header,
			RoomController,
			RoomPopout,
			Draggable,
			Meta
		},
		mixins: [ MainMixin, SocketMixin, MainMethodsMixin ],
		setup () {

			const faviconCanvas = ref<HTMLCanvasElement>();

			return {
				faviconCanvas
			};
		},
		data () {
			return {

				// Intervals
				cacheCleaner: 0,

				// Elements
				favicon: document.getElementById("favicon") as HTMLLinkElement | null
			};
		},
		computed: {
			isViewingRoom (): boolean {
				return this.$route.path.match(/^\/rooms\/.+$/i) !== null;
			},
			flavor (): Flavor {
				return this.$store.getters["settings/flavor"];
			}
		},
		watch: {
			user (user: AuthenticatedUser | null) {
				if (user) this.$socket.client.connect();
			},
			flavor: {
				immediate: true,
				handler (flavor: Flavor) {
					this.$nextTick(() => {

						const root = document.documentElement;

						root.style.setProperty("--primary-color", flavor.primary);
						root.style.setProperty("--primary-hover-color", flavor.primaryHover);

						this.updateFavicon(flavor.primary);
					});
				}
			}
		},
		async mounted () {

			this.cacheCleaner = window.setInterval(this.cleanCache, 600000);

			const token = getCookie("GIZMO_TOKEN");

			if (token) {
				try {
					this.login({ ...await getAuthenticatedUser(token), token });
				} catch (err) {
					console.error(err);
					this.logout();
				}
			} else {
				this.logout();
			}

			window.addEventListener("beforeunload", () => {
				this.$socket.client.disconnect();
			});

		},
		beforeUnmount () {
			clearInterval(this.cacheCleaner);
		},
		methods: {
			cleanCache () {

				const { shows, parsedLyrics, episodeChapters } = this.$store.state.cache;

				if (shows.size > 20) {

					const amountToClean = Math.floor(parsedLyrics.size / 2);
					let index = 0;

					shows.forEach((_, key: string) => {

						if (index < amountToClean) {
							shows.delete(key);
						}

						index++;
					});

					this.$store.commit("cache/REPLACE_SHOW_CACHE", shows);
				}

				if (parsedLyrics.size > 40) {

					const amountToClean = Math.floor(parsedLyrics.size / 2);
					let index = 0;

					parsedLyrics.forEach((_, key: string) => {

						if (index < amountToClean) {
							parsedLyrics.delete(key);
						}

						index++;
					});

					this.$store.commit("cache/REPLACE_PARSED_LYRICS_CACHE", parsedLyrics);
				}

				if (episodeChapters.size > 40) {

					const amountToClean = Math.floor(episodeChapters.size / 2);
					let index = 0;

					episodeChapters.forEach((_, key: string) => {

						if (index < amountToClean) {
							episodeChapters.delete(key);
						}

						index++;
					});

					this.$store.commit("cache/REPLACE_EPISODE_CHAPTERS_CACHE", episodeChapters);
				}
			},
			updateFavicon (color: string) {
				if (this.faviconCanvas && this.favicon) {

					const
						{ favicon, faviconCanvas } = this,
						ctx = faviconCanvas.getContext("2d"),
						{ width, height } = this.faviconCanvas;

					if (ctx) {

						const logo = new Image();
						logo.src = "/logo_flavorable.png";

						logo.onload = () => {

							ctx.beginPath();
							ctx.arc(width / 2, height / 2, 14, 0, 2 * Math.PI);
							ctx.fillStyle = color;
							ctx.fill();

							ctx.drawImage(logo, 0, 0);

							favicon.href = faviconCanvas.toDataURL("image/x-icon");
						};
					}
				}
			}
		},
		sockets: {
			connect () {
				if (this.user) {
					this.loginToSocket(this.user.token);
				}
			},
			exception (msg: unknown) {
				console.error(msg);
			},
			"ROOM:USER_JOIN" (user: User) {
				this.$store.commit("room/USER_JOIN_ROOM", user);
			},
			"ROOM:USER_LEAVE" (user: User) {
				if (user.id === this.user?.id && this.room) {
					this.$router.push("/rooms");
					this.$store.commit("room/LEAVE_ROOM");
				} else {
					this.$store.commit("room/USER_LEAVE_ROOM", user);
				}
			},
			"ROOM:UPDATE" (room: Room) {
				this.$store.commit("room/UPDATE_ROOM", room);
			},
			"ROOM:UPDATE_ROOM_DATA" (roomData: RoomData) {
				this.$store.commit("room/UPDATE_ROOM_DATA_LOADING_STATE", false);
				this.$store.commit("room/UPDATE_ROOM_DATA", roomData);
			}
		}
	});

</script>

<style lang="scss">

	@import "@styles/main";
	@import "@styles/global";
	@import "@styles/font";
	@import "@styles/animations";
	@import "@styles/mixins";
	@import "@styles/tooltip";

	:root {

		--font: Roboto, sans-serif;

		// Colors

		/*
			Dynamic:
			--primary-color
			--primary-hover-color
		*/

		--text-color: white;
		--faded-text-color: #868686;
		--faded-heading-text-color: #b4b4b4;
		--container-background-color: rgb(31, 31, 31);
		--container-hover-color: #494949;
		--background-color: #0d0d0d;
		--transparent-hover-color: rgba(13, 13, 13, .5);
		--tray-background-color: rgb(41, 41, 41);
		--tray-hover-background-color: rgb(65, 65, 65);
		--error-color: hsl(0deg, 95%, 60%);

		// Values
		--card-border-radius: 3px;
		--popup-border-radius: 8px;
		--button-border-radius: 10px;
		--overlay-background-color: rgba(0, 0, 0, .7);
		--border-style: 2px solid var(--primary-color);

		// Timing Functions
		--easing-enter: cubic-bezier(0, 1.68, .43, 1.01);
		--easing-leave: cubic-bezier(.67, 0, 1, -.83);

	}

	// Transitions

	.view-enter-active,
	.view-leave-active {
		transition: opacity .25s ease, transform .2s ease;
	}

	.view-enter-from,
	.view-leave-to {
		opacity: 0;
		transform: translateY(.3rem) scale(99.7%);
	}

	.popout-slide-enter-active {
		transition: opacity .2s ease, transform .4s var(--easing-enter);
	}

	.popout-slide-leave-active {
		transition: opacity .25s ease, transform .15s var(--easing-leave);
	}

	.popout-slide-enter-from,
	.popout-slide-leave-to {
		opacity: 0;
		transform: translateY(2rem) scale(95%);
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: .3s opacity ease;
	}

	.fade-leave-to,
	.fade-enter-from {
		opacity: 0;
	}

	// Globals

	img {
		color: transparent;
	}

	// Layout

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		overflow-x: hidden;
		overflow-y: hidden;
		width: 100%;
		height: 100%;
	}

	body {

		color: var(--text-color);
		background-color: var(--background-color);
		font-family: var(--font);

		width: 100%;
		height: 100%;

		margin: 0;

		overflow-x: hidden;
		overflow-y: scroll;

		&.no-scroll {

			overflow-y: hidden;

			#app {
				overflow-y: scroll;
			}
		}
	}

	.app-content-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.route-content {
		width: 1350px;
	}

	@media only screen and (max-width: 1400px) {
		.route-content {
			width: 100%;
			margin-left: 1.3rem;
			margin-right: 1.3rem;
		}
	}

	@media only screen and (max-width: 1200px) {
		.route-content {
			width: 100%;
			margin-left: .5rem;
			margin-right: .5rem;
		}
	}

	.room-popout-container {

		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		margin: 15px;
		pointer-events: none;
		z-index: 5;

		* {
			pointer-events: auto;
		}
	}

	.favicon-canvas {
		display: none;
	}

</style>
