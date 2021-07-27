// Modules
import { createApp } from "vue";
import VueSocketIO from "vue-socket.io-extended";
import { io } from "socket.io-client";
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

// Variables
const ioInstance = io(SOCKET_ENDPOINT);

if (typeof SOCKET_ENDPOINT === "string") {

	createApp(App)
		.use(Router)
		.use(Store)
		.use(VueSocketIO, ioInstance)
		.use(Particles)
		.directive("tooltip", Tooltip)
		.mount("#app");

} else {
	throw new Error("Environmental variable 'SOCKET_ENDPOINT' is not assigned");
}