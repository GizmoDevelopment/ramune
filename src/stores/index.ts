// Modules
import { createStore, createLogger } from "vuex";

// Types
import { User, AuthenticatedUser } from "gizmo-api/lib/types";
import { Show } from "@typings/show";
import { Room, RoomData, UpdatableRoomProperties } from "@typings/room";
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
		UPDATE_USER(state: State, user: AuthenticatedUser) {
			state.user = user;
		},
		JOIN_ROOM (state: State, room: Room) {
			state.room = room;
		},
		LEAVE_ROOM (state: State) {
			state.room = null;
		},
		USER_JOIN_ROOM (state: State, user: User) {
			if (state.room) {
				state.room.users.push(user);
			}
		},
		USER_LEAVE_ROOM (state: State, user: User) {
			if (state.room) {
				state.room.users = state.room.users.filter(({ id }) => id !== user.id);
			}
		},
		UPDATE_ROOM(state: State, data: UpdatableRoomProperties) {
			if (state.room) {
				state.room = { ...state.room, ...data };
			}
		},
		UPDATE_ROOM_DATA (state: State, roomData: RoomData) {
			if (state.room) {
				state.room.data = roomData;
			}
		}
	},
	plugins: [ createLogger() ] // REMOVE BEFORE PROD
});