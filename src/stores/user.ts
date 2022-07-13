// Types
import type { Module } from "vuex";
import type { AuthenticatedUser } from "gizmo-api";
import type { UserState } from "@typings/shims-vuex";

export default {
	namespaced: true,
	state () {
		return {
			user: null
		};
	},
	mutations: {
		UPDATE_USER (state: UserState, user: AuthenticatedUser) {
			state.user = user;
		},
		REMOVE_USER (state: UserState) {
			state.user = null;
		}
	}
} as Module<UserState, unknown>;