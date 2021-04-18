// Modules
import { createRouter, createWebHistory } from "vue-router";

// Views
import Home from "@views/Home.vue";
import Shows from "@views/Shows.vue";
import Show from "@views/Show.vue";

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
		{
			path: "/shows/:showId",
			component: Show,
			props: true
		},
	]
});