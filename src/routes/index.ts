// Modules
import { createRouter, createWebHistory } from "vue-router";

// Views
import Home from "@views/Home.vue";
import Shows from "@views/Shows.vue";
import Rooms from "@views/Rooms.vue";
import Player from "@views/Player.vue";

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
		},
		{
			path: "/watch/:showId/:episodeId?",
			component: Player,
			props: true
		}
	]
});

router.beforeEach(() =>{

	// changePageTitle("Ramune");

	return true;
});

export default router;