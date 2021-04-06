// Modules
import { createApp } from "vue";

// Vue
import App from "./App.vue";

// Routes
import Router from "./routes";

// Stores
import Store from "./stores";

createApp(App)
	.use(Router)
	.use(Store)
	.mount("#app");