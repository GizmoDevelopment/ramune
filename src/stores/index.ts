// Modules
import { createStore, createLogger } from "vuex";

// Types
import { User, AuthenticatedUser } from "gizmo-api/lib/types";
import { Show, ShowHusk } from "@typings/show";
import { Room, RoomData, UpdatableRoomProperties } from "@typings/room";
import { State } from "@typings/vuex";
import { ParsedLyrics } from "@typings/lyrics";

// Constants
// const DEV = import.meta.env.DEV;

export default createStore<State>({
	state () {
		return {
			shows: new Map(),
			cachedShowList: [],
			cachedParsedLyrics: {},
			user: null,
			room: null,
			roomVideoTeleportParent: "room-video-container",
			isRequestingRoomSync: false,
			isLoadingRoomData: false,
			connectError: ""
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
		},
		USER_JOIN_ROOM (state: State, user: User) {
			if (state.room) {
				state.room.users = state.room.users.filter(({ id }) => id !== user.id).concat(user);
			}
		},
		USER_LEAVE_ROOM (state: State, user: User) {
			if (state.room) {
				state.room.users = state.room.users.filter(({ id }) => id !== user.id);
			}
		},
		UPDATE_ROOM (state: State, data: UpdatableRoomProperties) {
			if (state.room) {
				state.room = { ...state.room, ...data };
			}
		},
		UPDATE_ROOM_DATA (state: State, roomData: RoomData) {
			if (state.room) {
				state.room.data = roomData;
			}
		},
		UPDATE_ROOM_CONTROLLER_STATE (state: State, newState: string | null) {
			state.roomVideoTeleportParent = newState;
			console.log(`ROOM CONTROLLER - ${newState}`);
		},
		CACHE_SHOW_LIST (state: State, newShowList: ShowHusk[]) {
			state.cachedShowList = newShowList;
		},
		UPDATE_ROOM_SYNC_REQUEST (state: State, newState: boolean) {
			state.isRequestingRoomSync = newState;
		},
		UPDATE_ROOM_DATA_LOADING_STATE (state: State, newState: boolean) {
			state.isLoadingRoomData = newState;
		},
		UPDATE_CONNECT_ERROR (state: State, message: string) {
			state.connectError = message;
		},
		CACHE_FORMATTED_LYRICS (state: State, { showId, lyrics }: { showId: string, lyrics: ParsedLyrics }) {
			state.cachedParsedLyrics[`${showId}-${lyrics.id}`] = lyrics;
		}
	},
	plugins: [ createLogger({
		logActions: true,
		logMutations: true
	}) ]
});