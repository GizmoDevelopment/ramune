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
		<transition name="slide" mode="out-in">
			<div v-if="room && !isCurrentlyViewingRoom">
				<RoomPopout />
			</div>
		</transition>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Utils
	import { getCookie } from "@utils/essentials";

	// Components
	import Header from "@components/Header.vue";
	import RoomPopout from "@components/RoomPopout.vue";

	// Types
	import { SocketResponse } from "@typings/main";
	import { User } from "gizmo-api/lib/types";
	import { Room, RoomData } from "@typings/room";

	export default defineComponent({
		name: "App",
		components: {
			Header,
			RoomPopout
		},
		computed: {
			room (): Room | null {
				return this.$store.state.room;
			},
			isCurrentlyViewingRoom () {
				return this.$route.path.match(/^\/rooms\/.*$/i) !== null;
			}
		},
		sockets: {
			connect () {

				const token = getCookie("GIZMO_TOKEN");

				if (token) {
					this.$socket.emit("CLIENT:AUTHENTICATE", { token }, (res: SocketResponse<User>) => {
						if (res.type === "success") {

							this.$store.commit("UPDATE_USER", { ...res.data, token });

							// Attempt to rejoin saved room
							if (this.room) {
								this.$socket.emit("CLIENT:JOIN_ROOM", this.room.id, (res: SocketResponse<Room>) => {
									if (res.type === "success") {
										this.$store.commit("JOIN_ROOM", res.data);
										this.$router.push(`/rooms/${ res.data.id }`);
									} else {
										this.$store.commit("LEAVE_ROOM");
									}
								});
							}

						} else {
							console.error(res.message);
						}
					});
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
		--container-background-color: #1C1C1C;
		--background-color: #101010;
		--primary-color: hsl(199, 95%, 60%);
		--primary-hover-color: hsl(199, 95%, 30%);
		--transparent-hover-color: rgba(28, 28, 28, .5);
		--error-color: hsl(0, 95%, 60%);

		/* Values */
		--card-border-radius: 3px;
		--popup-border-radius: 10px;
		--overlay-background-color: rgba(0, 0, 0, .7);

	}

	body {
		margin: 0;
		background-color: var(--background-color);
	}

	#content-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	@media only screen and (min-width: 1200px) {
		#content {
			width: 1200px;
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
		transition: opacity .3s ease;
	}

	.slide-enter-from,
	.slide-leave-to {
		opacity: 0;
	}

	.heading {
		font-size: 45px;
		font-weight: bold;
		text-align: left;
	}

	.primary-button {
		background-color: var(--primary-color);
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

	.input, .input-dark {
		color: var(--text-color);
		border: 2px solid;
		border-radius: var(--popup-border-radius);
		font-size: 1.1em;
		outline: none;
		padding: .2em .4em .2em .4em;
		transition: border-color .2s ease-in-out;
	}

	.input {
		background-color: var(--container-background-color);
		border-color: var(--container-background-color);
	}

	.input-dark {
		background-color: var(--background-color);
		border-color: var(--background-color);
	}

	.input:focus {
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
		font-family: var(--font);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: var(--text-color);
	}

	@media only screen and (max-width: 800px) {
		.heading {
			font-size: 30px;
		}
	}

	/* Tooltip */

	.tippy-box {
		border-radius: var(--popup-border-radius);
		box-shadow: 0 0 3px var(--primary-color);
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

</style>