<template>
	<div id="container">
		<div id="title-bar">
			<h2 id="room-name">{{ room.name }}</h2>
			<button class="button" @click="joinRoom()">
				<CaretRight />
			</button>
		</div>
		<RoomUserList :users="room.users" :host="room.host" />
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import RoomUserList from "@components/RoomUserList.vue";

	// Icons
	import CaretRight from "@assets/icons/caret-right.svg";

	// Types
	import { SuccessResponse, ErrorResponse } from "@typings/index";
	import { Room } from "@typings/room";

	export default defineComponent({
		name: "RoomCard",
		components: {
			CaretRight,
			RoomUserList
		},
		props: {
			room: {
				type: Object as PropType<Room>,
				required: true
			}
		},
		methods: {
			joinRoom () {
				if (this.room.id !== "") { // Don't join from dummy room cards
					if (this.$store.state.room?.id === this.room.id) {
						this.$router.push(`/rooms/${ this.room.id }`);
					} else {
						this.$socket.emit("client:join_room", this.room.id, (res: SuccessResponse<Room> | ErrorResponse) => {
							if (res.type === "success") {
								this.$store.commit("JOIN_ROOM", res.data);
								this.$router.push(`/rooms/${ res.data.id }`);
							} else {
								console.error(res.message);
							}
						});
					}
				}
			}
		}
	});

</script>

<style scoped>

	#container {
		width: 400px;
		background-color: var(--background-color);
		border-radius: var(--popup-border-radius);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		padding: .75em;
	}

	#title-bar {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1em;
	}

	#room-name {
		margin-top: 0;
		margin-bottom: 0;
	}

	@media only screen and (max-width: 600px) {
		
		#container {
			width: 300px;
		}

		#room-name {
			font-size: 1em;
		}

	}

</style>