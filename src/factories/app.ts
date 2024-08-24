// Modules
import { createApp as _createApp } from "vue";
import VueSocketIO from "vue-socket.io-extended";
import io from "socket.io-client";
import { createHead } from "@vueuse/head";

// Factories
import { createRouter } from "@factories/router";
import { createStore } from "@factories/store";

// Directives
import Tooltip from "@directives/tooltip";

// Plugins
import i18n from "@plugins/i18n";

// Views
import _App from "@views/App.vue";

// Types
import type { App } from "vue";

// Constants
const SOCKET_ENDPOINT = import.meta.env.VITE_SOCKET_ENDPOINT;

// Variables
const head = createHead();
const router = createRouter();
const store = createStore();
const ioInstance = io(SOCKET_ENDPOINT);

export function createApp (): App<Element> {

	const app = _createApp(_App);

	app
		.use(store)
		.use(router)
		.use(head)
		.use(i18n, store)
		.use(VueSocketIO, ioInstance)
		.directive("tooltip", Tooltip);

	return app;
}
