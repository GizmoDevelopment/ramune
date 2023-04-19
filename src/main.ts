// Factories
import { createApp } from "@factories/app";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import RPCClient from "@factories/rpc";

// Variables
const app = createApp();

if (!import.meta.env.VITE_CDN_ENDPOINT) {
	console.error("Missing environmental variable VITE_CDN_ENDPOINT");
}

if (!import.meta.env.VITE_SHOW_ENDPOINT) {
	console.error("Missing environmental variable VITE_SHOW_ENDPOINT");
}

if (!import.meta.env.VITE_SOCKET_ENDPOINT) {
	console.error("Missing environmental variable VITE_SOCKET_ENDPOINT");
}

app.mount("#app");
