// Modules
import { createStore } from "vuex";

// Types
import { AuthenticatedUser } from "gizmo-api/lib/types";
import { Show } from "@typings/show";
import { State } from "@typings/vuex";

export default createStore<State>({
	state () {
		return {
			shows: new Map(),
			user: null
		};
	},
	mutations: {
		CACHE_SHOW (state: State, show: Show) {
			state.shows.set(show.id, show);
		},
		UPDATE_USER (state: State, user: AuthenticatedUser) {
			state.user = user;
		}
	}
});