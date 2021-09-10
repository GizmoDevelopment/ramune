// Modules
import { App, createSSRApp } from "vue";
import VueSocketIO from "vue-socket.io-extended";
import { io } from "socket.io-client";

// Components
import VueApp from "@views/App.vue";

// Routes
import { createRouter } from "@factories/router";

// Stores
import MainStore from "@stores/main";

// Constants
const SOCKET_ENDPOINT = import.meta.env.VITE_SOCKET_ENDPOINT;

// Variables
const ioInstance = io(SOCKET_ENDPOINT);

// Types
import { Router } from "vue-router";

interface CreateAppReturn {
	app: App<Element>;
	router: Router;
}

export function createApp (): CreateAppReturn {

	if (typeof SOCKET_ENDPOINT !== "string") {
		throw Error("Environmental variable 'SOCKET_ENDPOINT' is not assigned");
	}

	const
		app = createSSRApp(VueApp),
		router = createRouter();

	app
		.use(router)
		.use(MainStore)
		.use(VueSocketIO, ioInstance);

	return {
		app,
		router
	};
}