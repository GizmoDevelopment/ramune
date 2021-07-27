// Modules
import { createStore, createLogger } from "vuex";

// Stores
import CacheStore from "@stores/cache";
import RoomStore from "@stores/room";
import UserStore from "@stores/user";
import GenericStore from "@stores/generic";

// Constants
const DEV = import.meta.env.DEV;

export default createStore({
	modules: {
		cache: CacheStore,
		room: RoomStore,
		user:UserStore,
		generic: GenericStore
	},
	plugins: [
		createLogger({
			logActions: DEV,
			logMutations: DEV
		})
	]
});