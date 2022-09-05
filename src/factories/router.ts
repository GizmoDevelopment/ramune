// Views
import Home from "@views/Home.vue";
import Shows from "@views/Shows.vue";
import Rooms from "@views/Rooms.vue";
import Player from "@views/Player.vue";
import ErrorView from "@views/Error.vue";

// Types
import type { RouteLocation, RouteRecordRaw } from "vue-router";

export const routes = [
	{
		name: "home",
		path: "/",
		component: Home
	},
	{
		name: "show",
		path: "/shows/:showId?",
		component: Shows,
		props: true
	},
	{
		name: "rooms",
		path: "/rooms",
		component: Rooms
	},
	{
		name: "room",
		path: "/rooms/:roomId",
		component: () => import("@views/RoomLoader.vue"),
		props: true
	},
	{
		name: "player",
		path: "/watch/:showId/:episodeId?",
		component: Player,
		props: (route: RouteLocation) => {
			return {
				showId: route.params.showId,
				episodeId: Number(route.params.episodeId)
			};
		}
	},
	{
		name: "error",
		path: "/:pathMatch(.*)*",
		component: ErrorView
	}
] as RouteRecordRaw[];