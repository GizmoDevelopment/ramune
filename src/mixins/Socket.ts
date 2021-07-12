// Modules
import { defineComponent } from "vue";

// Types
import { User, AuthenticatedUser } from "gizmo-api/lib/types";
import { Room } from "@typings/room";
import { SocketResponse } from "@typings/main";
import { setCookie } from "@utils/dom";

export default defineComponent({
	computed: {
		room (): Room | null {
			return this.$store.state.room;
		}
	},
	methods: {
		login (user: AuthenticatedUser) {
			if (user) {

				this.$store.commit("UPDATE_USER", user);
				setCookie("GIZMO_TOKEN", user.token);

				this.loginToSocket(user.token);

			}
		},
		loginToSocket (token: string) {
			this.$socket.emit("CLIENT:AUTHENTICATE", { token }, (res: SocketResponse<User>) => {
				if (res.type === "success") {

					this.$store.commit("UPDATE_USER", { ...res.data, token });

					// Attempt to rejoin saved room
					if (this.room) {
						this.$socket.emit("CLIENT:JOIN_ROOM", this.room.id, (res: SocketResponse<Room>) => {
							if (res.type === "success") {
								this.$store.commit("JOIN_ROOM", res.data);
								this.$router.push(`/rooms/${res.data.id}`);
							} else {
								this.$store.commit("LEAVE_ROOM");
							}
						});
					}

				} else {
					this.$store.commit("UPDATE_CONNECT_ERROR", res.message);
					console.error(res.message);
				}
			});
		}
	}
});