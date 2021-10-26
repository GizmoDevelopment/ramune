<template>
	<Header />
	<div class="app-content-container">
		<div class="route-content">
			<router-view v-slot="{ Component }">
				<transition name="view" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</div>
		<div class="room-popout-container">
			<transition name="popout-slide" mode="out-in">
				<div v-if="room && !isViewingRoom">
					<RoomPopout :room="room" />
				</div>
			</transition>
		</div>
		<div v-if="room">
			<RoomController :room="room" />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";
	import { getAuthenticatedUser } from "gizmo-api";

	// Mixins
	import MainMixin from "@mixins/Main";
	import SocketMixin from "@mixins/Socket";

	// Components
	import Header from "@components/Header.vue";
	import RoomController from "@components/room/RoomController.vue";
	import RoomPopout from "@components/room/RoomPopout.vue";

	// Utils
	import { getCookie } from "@utils/dom";

	// Types
	import type { AuthenticatedUser, User } from "gizmo-api/lib/types";
	import type { Room, RoomData } from "@typings/room";
	import type { Flavor } from "@typings/settings";

	export default defineComponent({
		name: "App",
		components: {
			Header,
			RoomController,
			RoomPopout
		},
		mixins: [ MainMixin, SocketMixin ],
		data () {
			return {
				cacheCleaner: 0
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

						const
							root = document.documentElement,
							favicon = document.getElementById("favicon") as HTMLLinkElement;

						root.style.setProperty("--primary-color", flavor.primary);
						root.style.setProperty("--primary-hover-color", flavor.primaryHover);

						if (favicon) {
							favicon.href = `/favicons/${this.$store.state.settings.flavor}.png`;
						}
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
				}
			}

		},
		beforeUnmount () {
			clearInterval(this.cacheCleaner);
		},
		methods: {
			cleanCache () {

				const { shows, parsedLyrics } = this.$store.state.cache;

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
		transition: opacity .25s ease, transform .25s ease;
	}

	.view-enter-from,
	.view-leave-to {
		opacity: 0;
		transform: translateY(.5rem) scale(99%);
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
	}

	body {

		color: var(--text-color);
		background-color: var(--background-color);
		font-family: var(--font);

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
		left: 0;
		bottom: 0;
		z-index: 10;
		margin-left: 15px;
		margin-bottom: 15px;
	}

</style>