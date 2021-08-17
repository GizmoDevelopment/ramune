// Modules
import { defineComponent } from "vue";

// Types
import { SocketResponse } from "@typings/main";
import { JoinRoomOptions, Room } from "@typings/room";

export default defineComponent({
	methods: {
		joinRoom (options: JoinRoomOptions): Promise<Room> {
			return new Promise((res, rej) => {
				if (this.$store.state.room.room?.id === options.id) {
					this.$router.push(`/rooms/${options.id}`);
				} else {
					this.$socket.client.emit("CLIENT:JOIN_ROOM", options, (response: SocketResponse<Room>) => {
						if (response.type === "success") {

							const room = response.data;

							this.$store.commit("room/JOIN_ROOM", room);
							this.$router.push(`/rooms/${room.id}`);

							res(room);
						} else {
							console.error(response.message);
							rej(response.message);
						}
					});
				}
			});
		},
		leaveRoom (): Promise<void> {
			return new Promise(res => {

				this.$router.push("/rooms");

				// Don't trap the user in a room if the socket doesn't respond
				this.$socket.client.emit("CLIENT:LEAVE_ROOM", (response: SocketResponse<string>) => {
					if (response.type === "error") {
						console.error(response.message);
					}
				});

				res();
			});
		}
	}
});