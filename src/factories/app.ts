// Modules
import { App, createSSRApp } from "vue";
import VueSocketIO from "vue-socket.io-extended";
import { io } from "socket.io-client";

// Views
import VueApp from "@views/App.vue";

// Factories
import { createRouter } from "@factories/router";
import { createStore } from "@factories/store";

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
		router = createRouter(),
		store = createStore();

	app
		.use(router)
		.use(store)
		.use(VueSocketIO, ioInstance);

	return {
		app,
		router
	};
}