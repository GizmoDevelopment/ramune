// Modules
import { defineComponent } from "vue";

// Mixins
import SocketMixin from "@mixins/Socket";

// Utils
import { setCookie, removeCookie } from "@utils/dom";
import { getUserFromAuthenticatedUser } from "@utils/user";

// Types
import type { AuthenticatedUser } from "gizmo-api";

export default defineComponent({
	mixins: [ SocketMixin ],
	methods: {
		login (user: AuthenticatedUser) {

			this.$store.commit("user/UPDATE_USER", user);
			this.$store.commit("cache/CACHE_USER", getUserFromAuthenticatedUser(user));

			this.loginToSocket(user.token);

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