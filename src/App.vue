<template>
	<Header />
	<div id="content-container">
		<div id="content">
			<router-view v-slot="{ Component }">
				<transition name="fade-view" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</div>
		<div v-if="room && !isCurrentlyViewingRoom">
			<RoomPopout />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";
	import { getAuthenticatedUser } from "gizmo-api";

	// Utils
	import { getCookie } from "@utils/essentials";

	// Components
	import Header from "@components/Header.vue";
	import RoomPopout from "@components/RoomPopout.vue";

	// Types
	import { SuccessResponse, ErrorResponse } from "@typings/index";
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
		async mounted () {

			let token = getCookie("GIZMO_TOKEN");

			if (token) {

				try {
					
					token = decodeURIComponent(token);

					const user = await getAuthenticatedUser(token);

					this.$store.commit("UPDATE_USER", { ...user, token });

					this.$socket.emit("client:authenticate", { token }, ({ type, message }: SuccessResponse<User> | ErrorResponse) => {
						if (type !== "success") {
							console.error(message);
						}
					});

				} catch (err) {
					console.error(err);
				}

			}
		},
		sockets: {
			"client:join_room": function (user: User) {
				this.$store.commit("USER_JOIN_ROOM", user);
			},
			"client:leave_room": function (userId: number) {
				this.$store.commit("USER_LEAVE_ROOM", userId);
			},
			"client:update_room": function (room: Room) {
				this.$store.commit("UPDATE_ROOM", room);
			},
			"client:update_room_data": function (roomData: RoomData) {
				this.$store.commit("UPDATE_ROOM_DATA", roomData);
			}
		}
	});

</script>

<style>

	:root {

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

	.fade-view-enter-active,
	.fade-view-leave-active {
		transition: all .3s ease;
	}

	.fade-view-enter-from,
	.fade-view-leave-to {
		opacity: 0;
		transform: translateY(2em);
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

	.heading {
		font-size: 45px;
		font-weight: bold;
		text-align: left;
	}

	.button {
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
	}

	.input, .input-dark {
		color: var(--text-color);
		border: 2px solid;
		border-radius: var(--popup-border-radius);
		font-size: 1.1em;
		outline: none;
		padding-left: .3em;
		padding-right: .3em;
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
		font-family: Roboto, sans-serif;
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

</style>