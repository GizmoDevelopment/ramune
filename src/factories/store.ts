// Modules
import { createStore as _createStore, createLogger, Store } from "vuex";

// Stores
import CacheStore from "@stores/cache";
import RoomStore from "@stores/room";
import UserStore from "@stores/user";
import GenericStore from "@stores/generic";
import SettingsStore from "@stores/settings";

// Types
import { State } from "@typings/shims-vuex";

// Constants
const DEV = import.meta.env.DEV;

export function createStore (): Store<State> {
	return _createStore<State>({
		modules: {
			cache: CacheStore,
			room: RoomStore,
			user: UserStore,
			generic: GenericStore,
			settings: SettingsStore
		},
		plugins: [
			createLogger({
				logActions: DEV,
				logMutations: DEV
			})
		]
	});
}