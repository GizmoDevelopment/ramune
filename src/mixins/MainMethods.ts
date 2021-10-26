// Modules
import { defineComponent } from "vue";

// Utils
import { setCookie, removeCookie } from "@utils/dom";

// Types
import type { AuthenticatedUser } from "gizmo-api/lib/types";

export default defineComponent({
	methods: {
		login (user: AuthenticatedUser) {

			this.$store.commit("user/UPDATE_USER", user);
			this.$store.commit("cache/CACHE_USER", user);

			setCookie("GIZMO_TOKEN", user.token);
		},
		logout () {

			this.$store.commit("user/REMOVE_USER");
			this.$store.commit("cache/CACHE_USER", null);

			removeCookie("GIZMO_TOKEN");

			if (this.$socket.connected) {
				this.$socket.client.disconnect();
			}
		}
	}
});