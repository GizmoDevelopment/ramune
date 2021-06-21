<template>
	<Header />
	<div id="content-container">
		<div id="content">
			<router-view v-slot="{ Component }">
				<transition name="view" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</div>
		<div id="room-popout-container">
			<transition name="slide" mode="out-in">
				<div v-if="room && !isViewingRoom">
					<RoomPopout :room="room" />
				</div>
			</transition>
		</div>
		<div v-if="room">
			<RoomVideoController :room="room" />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";
	import { getAuthenticatedUser } from "gizmo-api";

	// Mixins
	import Socket from "@mixins/Socket";

	// Components
	import Header from "@components/Header.vue";
	import RoomVideoController from "@components/room/RoomVideoController.vue";
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
			RoomVideoController,
			RoomPopout
		},
		mixins: [ Socket ],
		computed: {
			room (): Room | null {
				return this.$store.state.room;
			},
			user (): AuthenticatedUser | null {
				return this.$store.state.user;
			},
			isViewingRoom (): boolean {
				return this.$route.path.match(/^\/rooms\/.*$/i) !== null;
			}
		},
		async mounted () {

			const token = getCookie("GIZMO_TOKEN");

			if (token) {
				try {
					this.login({ ...await getAuthenticatedUser(token), token });
				} catch (err) {
					console.error(err);
				}
			}

		},
		sockets: {
			connect () {
				if (this.user) {
					this.loginToSocket(this.user.token);
				}
			},
			"ROOM:USER_JOIN" (user: User) {
				this.$store.commit("USER_JOIN_ROOM", user);
			},
			"ROOM:USER_LEAVE" (user: User) {
				this.$store.commit("USER_LEAVE_ROOM", user);
			},
			"ROOM:UPDATE" (room: Room) {
				this.$store.commit("UPDATE_ROOM", room);
			},
			"ROOM:UPDATE_ROOM_DATA" (roomData: RoomData) {
				this.$store.commit("UPDATE_ROOM_DATA", roomData);
			}
		}
	});

</script>

<style>

	:root {

		--font: Roboto, sans-serif;

		/* Colors */
		--text-color: white;
		--container-background-color: hsl(0, 0%, 12%);
		--background-color: #0D0D0D;
		--primary-color: hsl(200, 90%, 60%);
		--primary-hover-color: hsl(200, 90%, 40%);
		--transparent-hover-color: rgba(13, 13, 13, .5);
		--error-color: hsl(0, 95%, 60%);

		/* Values */
		--card-border-radius: 3px;
		--popup-border-radius: 8px;
		--overlay-background-color: rgba(0, 0, 0, .7);

	}

	body {
		margin: 0;
		background-color: var(--background-color);
		font-family: var(--font);
		color: var(--text-color);
	}

	#content-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	@media only screen and (min-width: 1350px) {
		#content {
			width: 1350px;
		}
	}

	@media only screen and (max-width: 1200px) {
		#content {
			width: 100%;
			padding-left: 30px;
			padding-right: 30px;
		}
	}

	.view-enter-active,
	.view-leave-active {
		transition: transform .3s ease, opacity .3s ease;
	}

	.view-enter-from,
	.view-leave-to {
		opacity: 0;
		transform: translateY(2em);
	}

	.slide-enter-active,
	.slide-leave-active {
		transition: opacity .4s ease, transform .5s ease;
	}

	.slide-enter-from,
	.slide-leave-to {
		opacity: 0;
		transform: translateY(1em);
	}

	.heading {
		font-size: 45px;
		font-weight: bold;
		text-align: left;
	}

	*[theme=light] {
		background-color: var(--container-background-color);
	}

	*[theme=dark] {
		background-color: var(--background-color);
	}

	.error {
		margin-top: 0;
		margin-bottom: 0;
		color: var(--error-color);
	}

	.primary-button {
		background-color: var(--primary-color);
		border-color: var(--primary-color);
		color: var(--text-color);
		border: 0;
		border-radius: 10px;
		padding: 5px;
		padding-left: 20px;
		padding-right: 20px;
		font-size: 18px;
		font-weight: 500;
		transition: .2s background-color ease-in-out;
	}

	.primary-button:hover {
		background-color: var(--primary-hover-color);
	}

	/*.button {
		background-color: var(--primary-color);
		color: var(--text-color);
		border: 2px solid var(--primary-color);
		border-radius: var(--popup-border-radius);
		font-size: 1.5em;
		transition: background-color .2s ease-in-out, border-color .2s ease-in-out;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		align-content: center;
		padding: 4px;
	}

	.button:hover {
		background-color: var(--primary-hover-color);
		border-color: var(--primary-hover-color);
	}*/

	.primary-button:hover, .button:hover {
		cursor: pointer;
	}

	.icon-button {
		border-width: 2px;
		padding: 6px;
		font-size: 1.5em;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		align-content: center;
	}

	.input, .input[theme=dark] {
		font-family: var(--font);
		color: var(--text-color);
		border: 2px solid;
		border-radius: var(--popup-border-radius);
		font-size: 1.1em;
		outline: none;
		padding: .2em .4em .2em .4em;
		box-sizing: border-box;
		transition: border-color .2s ease-in-out;
	}

	.input {
		background-color: var(--container-background-color);
		border-color: var(--container-background-color);
	}

	.input[theme=dark] {
		background-color: var(--background-color);
		border-color: var(--background-color);
	}

	.input:focus, .input-dark:focus {
		border-color: var(--primary-color);
	}

	.faded {
		opacity: .5;
	}

	.icon {
		height: 1em;
	}

	.icon path {
		fill: var(--text-color);
		stroke: var(--text-color);
	}

	.husk, .husk-dark {
		color: transparent;
		border: none !important;
		user-select: none;
		border-radius: var(--card-border-radius);
	}

	.husk {
		background-color: var(--background-color) !important;
	}

	.husk-dark {
		background-color: var(--container-background-color) !important;
	}

	.overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-color: var(--overlay-background-color);
		border-radius: var(--card-border-radius);
		transition: opacity .2s ease;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.hover-opacity {
		opacity: 0;
		transition: opacity .2s ease-in-out;
	}

	.hover-opacity:hover {
		opacity: 1;
		cursor: pointer;
	}

	.anchor-without-decoration {
		text-decoration: none;
		color: inherit;
	}

	.hover-container {
		transition: .2s background ease-out;
		border-radius: var(--card-border-radius);
	}

	.hover-container:hover {
		background-color: var(--transparent-hover-color);
		cursor: pointer;
	}

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
	}

	@media only screen and (max-width: 800px) {
		.heading {
			font-size: 30px;
		}
	}

	/* Tooltip */

	.tippy-box {
		border-radius: var(--popup-border-radius);
		border: 2px solid var(--primary-color);
	}

	.tippy-box, .tippy-arrow {
		background-color: var(--container-background-color);
	}

	.tippy-content {
		color: var(--text-color);
		font-family: var(--font);
		padding-left: 9px;
		padding-right: 9px;
		padding-top: 5px;
		padding-bottom: 5px;
	}

	#room-popout-container {
		position: fixed;
		right: 0;
		bottom: 0;
		z-index: 10;
		margin-right: 15px;
		margin-bottom: 15px;
	}

</style>