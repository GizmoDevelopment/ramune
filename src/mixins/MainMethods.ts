// Modules
import { defineComponent } from "vue";

// Utils
import { setCookie, removeCookie } from "@utils/dom";
import { removeSetting, saveSetting } from "@utils/storage";

// Types
import type { AuthenticatedUser } from "gizmo-api/lib/types";

export default defineComponent({
	methods: {
		login (user: AuthenticatedUser) {

			this.$store.commit("user/UPDATE_USER", user);
			setCookie("GIZMO_TOKEN", user.token);


		},
		logout () {

			this.$store.commit("user/REMOVE_USER");
			removeCookie("GIZMO_TOKEN");

			if (this.$socket.connected) {
				this.$socket.client.disconnect();
			}


		}
	}
});