// Types
import type { Module } from "vuex";
import type { User } from "gizmo-api";
import type { Room, RoomData, UpdatableRoomProperties } from "@typings/room";
import type { RoomState } from "@typings/shims-vuex";

export default {
	namespaced: true,
	state () {
		return {
			room: null,
			roomVideoTeleportParent: null,
			isLoadingRoomData: false,
			typingUserList: []
		};
	},
	mutations: {
		JOIN_ROOM (state: RoomState, room: Room) {
			state.room = room;
		},
		LEAVE_ROOM (state: RoomState) {
			state.room = null;
		},
		USER_JOIN_ROOM (state: RoomState, user: User) {
			if (state.room) {
				state.room.users = state.room.users.filter(({ id }) => id !== user.id).concat(user);
			}
		},
		USER_LEAVE_ROOM (state: RoomState, user: User) {
			if (state.room) {
				state.room.users = state.room.users.filter(({ id }) => id !== user.id);
			}
		},
		UPDATE_ROOM (state: RoomState, data: UpdatableRoomProperties) {
			if (state.room) {
				state.room = { ...state.room, ...data };
			}
		},
		UPDATE_ROOM_DATA (state: RoomState, roomData: RoomData) {
			if (state.room) {
				state.room.data = roomData;
			}
		},
		UPDATE_ROOM_CONTROLLER_STATE (state: RoomState, newState: string | null) {
			state.roomVideoTeleportParent = newState;
		},
		UPDATE_ROOM_DATA_LOADING_STATE (state: RoomState, newState: boolean) {
			state.isLoadingRoomData = newState;
		},
		USER_START_TYPING (state: RoomState, userId: number) {
			state.typingUserList.push(userId);
		},
		USER_STOP_TYPING (state: RoomState, userId: number) {
			state.typingUserList = state.typingUserList.filter(_userId => _userId !== userId);
		}
	}
} as Module<RoomState, unknown>;