// Types
import { Module } from "vuex";
import { AuthenticatedUser } from "gizmo-api/lib/types";
import { UserState } from "@typings/shims-vuex";

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
		}
	}
} as Module<UserState, any>;