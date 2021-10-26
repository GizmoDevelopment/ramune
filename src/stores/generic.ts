// Types
import type { Module } from "vuex";
import type { GenericState } from "@typings/shims-vuex";

export default {
	namespaced: true,
	state () {
		return {
			connectError: "",
			shouldDisplayHanyuu: Math.floor(Math.random() * 40) === 34
		};
	},
	mutations: {
		UPDATE_CONNECT_ERROR (state: GenericState, message: string) {
			state.connectError = message;
		}
	}
} as Module<GenericState, unknown>;