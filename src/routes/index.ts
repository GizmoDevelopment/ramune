// Modules
import { createRouter, createWebHistory } from "vue-router";

// Utils
import { changePageTitle } from "@utils/dom";

// Views
import Home from "@views/Home.vue";
import Shows from "@views/Shows.vue";
import Rooms from "@views/Rooms.vue";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			component: Home
		},
		{
			path: "/shows/:showId?",
			component: Shows,
			props: true
		},
		{
			path: "/rooms",
			component: Rooms
		}
	]
});

router.beforeEach(() =>{

	changePageTitle("Ramune");

	return true;
});

export default router;