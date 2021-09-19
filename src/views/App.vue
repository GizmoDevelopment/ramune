<template>
	<Header />
	<div class="content-container">
		<div class="content">
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
	import { AuthenticatedUser, User } from "gizmo-api/lib/types";
	import { Room, RoomData } from "@typings/room";

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
			}
		},
		watch: {
			user (user: AuthenticatedUser | null) {
				if (user) {
					this.$socket.client.open();
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

	@import "@styles/main.scss";
	@import "@styles/global.scss";
	@import "@styles/font.scss";
	@import "@styles/animations.scss";
	@import "@styles/mixins.scss";
	@import "@styles/tooltip.scss";

	:root {

		--font: Roboto, sans-serif;

		/* Colors */
		--text-color: white;
		--faded-text-color: #868686;
		--primary-color: #3db8f5;
		--primary-hover-color: #0a85c2;
		--container-background-color: rgb(31, 31, 31);
		--container-hover-color: #494949;
		--background-color: #0D0D0D;
		--transparent-hover-color: rgba(13, 13, 13, .5);
		--error-color: hsl(0, 95%, 60%);

		/* Values */
		--card-border-radius: 3px;
		--popup-border-radius: 8px;
		--overlay-background-color: rgba(0, 0, 0, .7);

		/* Timing Functions */
		--easing-enter: cubic-bezier(0, 1.68, .43, 1.01);
		--easing-leave: cubic-bezier(.67, 0, 1, -.83);

	}

	/* Transitions */

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

	/* Globals */

	*[variant=light] {
		@include light;
	}

	*[variant=dark] {
		@include dark;
	}

	img {
		color: transparent;
	}

	// Can we please, for the love of God, incorporate a standard for this
	// Also, for some reason, I cannot combine these together? What the fuck?

	@mixin track () {
		-webkit-appearance: none;
		background: variable(container-hover-color);
		height: .6rem;
		border-radius: 1rem;
	}

	@mixin progress () {
		-webkit-appearance: none;
		background: variable(primary-color);
		border-radius: 1rem;
		height: .6rem;
	}

	@mixin thumb () {
		-webkit-appearance: none;
		background: variable(text-color);
		width: 1.1rem;
		height: 1.1rem;
		border: 2px solid variable(text-color);
		border-radius: 50%;
		cursor: pointer;
	}

	@media screen and (-webkit-min-device-pixel-ratio: 0) {
		input[type="range"] {
			-webkit-appearance: none;
		}
	}

	input[type="range"] {

		background: transparent;
		padding: .1rem 0 .1rem 0; // Allows the thumb to look like a perfect oversized circle

		// Firefox
		&::-moz-range-track { @include track; overflow: hidden; }
		&::-moz-range-progress { @include progress }
		&::-moz-range-thumb { @include thumb }

		// Safari/Chrome/Edge
		// Support the HTML5 specification or else you can eat my shit, WebKit/Blink
		// &::-webkit-slider-runnable-track { @include track }
		&::-webkit-slider-container { @include track }
		&::-webkit-slider-thumb { @include thumb }

	}

	/* Layout */

	body {
		margin: 0;
		background-color: var(--background-color);
		font-family: var(--font);
		color: var(--text-color);
	}

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.content-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.content {
		width: 1350px;
	}

	@media only screen and (max-width: 1400px) {
		.content {
			width: 100%;
			margin-left: 1.3rem;
			margin-right: 1.3rem;
		}
	}

	@media only screen and (max-width: 1200px) {
		.content {
			width: 100%;
			margin-left: .5rem;
			margin-right: .5rem;
		}
	}

	@media only screen and (max-width: 800px) {
		.heading {
			font-size: 30px;
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