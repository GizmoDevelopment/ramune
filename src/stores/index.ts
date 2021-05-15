// Modules
import { createStore } from "vuex";

// Types
import { AuthenticatedUser } from "gizmo-api/lib/types";
import { Show } from "@typings/show";
import { Room } from "@typings/room";
import { State } from "@typings/vuex";

export default createStore<State>({
	state () {
		return {
			shows: new Map(),
			user: null,
			room: null
		};
	},
	mutations: {
		CACHE_SHOW (state: State, show: Show) {
			state.shows.set(show.id, show);
		},
		UPDATE_USER (state: State, user: AuthenticatedUser) {
			state.user = user;
		},
		JOIN_ROOM (state: State, room: Room) {
			state.room = room;
		},
		LEAVE_ROOM (state: State) {
			state.room = null;
		}
	}
});