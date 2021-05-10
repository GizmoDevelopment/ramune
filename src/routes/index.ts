// Modules
import { createRouter, createWebHistory } from "vue-router";

// Utils
import { changePageTitle } from "@utils/dom";

// Views
import Home from "@views/Home.vue";
import Shows from "@views/Shows.vue";
import Show from "@views/Show.vue";
import Rooms from "@views/Rooms.vue";

const router = createRouter({
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
		{
			path: "/rooms",
			component: Rooms
		},
	]
});

router.beforeEach(() =>{

	changePageTitle("Ramune");

	return true;
});

export default router;