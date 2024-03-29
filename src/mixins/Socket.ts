// Modules
import { defineComponent } from "vue";

// Types
import type { User } from "gizmo-api";
import type { Room } from "@typings/room";
import type { SocketResponse } from "@typings/main";

export default defineComponent({
	computed: {
		room (): Room | null {
			return this.$store.state.room.room;
		}
	},
	methods: {
		loginToSocket (token: string) {
			this.$socket.client.emit("CLIENT:AUTHENTICATE", { token }, (res: SocketResponse<User>) => {
				if (res.type === "success") {

					this.$store.commit("user/UPDATE_USER", { ...res.data, token });

					// Attempt to rejoin saved room
					if (this.room) {
						this.$socket.client.emit("CLIENT:JOIN_ROOM", this.room.id, (res: SocketResponse<Room>) => {
							if (res.type === "success") {
								this.$store.commit("room/JOIN_ROOM", res.data);
								this.$router.push(`/rooms/${res.data.id}`);
							} else {
								this.$store.commit("room/LEAVE_ROOM");
							}
						});
					}

				} else {
					this.$store.commit("generic/UPDATE_CONNECT_ERROR", res.message);
					console.error(res.message);
				}
			});
		}
	}
});