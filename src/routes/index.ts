// Modules
import { createRouter, createWebHistory } from "vue-router";

// Views
import Home from "@views/Home.vue";
import Shows from "@views/Shows.vue";

export default createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			component: Home
		},
		{
			path: "/shows",
			component: Shows
		},
	]
});