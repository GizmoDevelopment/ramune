// Modules
import { createApp } from "vue";
import VueSocketIO from "vue-3-socket.io";
import SocketIO from "socket.io-client";
import Particles from "particles.vue3";

// Vue
import App from "@views/App.vue";

// Routes
import Router from "./routes";

// Stores
import Store from "./stores";

// Directives
import Tooltip from "./directives/tooltip";

// Constants
const SOCKET_ENDPOINT = import.meta.env.VITE_SOCKET_ENDPOINT;
// const DEV = import.meta.env.DEV;

if (typeof SOCKET_ENDPOINT === "string") {

	createApp(App)
		.use(Router)
		.use(Store)
		.use(new VueSocketIO({
			debug: true,
			connection: SocketIO(SOCKET_ENDPOINT),
			vuex: {
				store: Store,
				actionPrefix: "SOCKET_",
				mutationPrefix: "SOCKET_",
			}
		}))
		.use(Particles)
		.directive("tooltip", Tooltip)
		.mount("#app");

} else {
	throw new Error("Environmental variable 'SOCKET_ENDPOINT' is not assigned");
}