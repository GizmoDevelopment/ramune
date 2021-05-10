// Modules
import { createApp } from "vue";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";

// Vue
import App from "./App.vue";

// Routes
import Router from "./routes";

// Stores
import Store from "./stores";

// Constants
const SOCKET_ENDPOINT = import.meta.env.VITE_SOCKET_ENDPOINT;

/**
 * !!! NOTE !!!
 * REMOVE PATCH-PACKAGE ONCE VUE-SOCKET.IO OFFICIALLY SUPPORTS VUE 3
 */

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
		.mount("#app");

} else {
	throw new Error("Environmental variable 'SOCKET_ENDPOINT' is not assigned");
}