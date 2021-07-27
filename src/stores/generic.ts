// Types
import { Module } from "vuex";
import { GenericState } from "@typings/shims-vuex";

export default {
	namespaced: true,
	state () {
		return {
			connectError: ""
		};
	},
	mutations: {
		UPDATE_CONNECT_ERROR (state: GenericState, message: string) {
			state.connectError = message;
		}
	}
} as Module<GenericState, any>;