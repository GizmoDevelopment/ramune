// Modules
import { createStore } from "vuex";

// Types
import { Show } from "@typings/types";
import { State } from "@typings/vuex";

export default createStore<State>({
	state () {
		return {
			shows: new Map()
		};
	},
	mutations: {
		CACHE_SHOW (state: State, show: Show) {
			state.shows.set(show.id, show);
		}
	}
});