// Types
import { Module } from "vuex";
import type { CustomMeta, GenericState } from "@typings/shims-vuex";

export interface InputCustomMeta {
	title?: string;
	description?: string;
	image_url?: string;
}

const DEFAULT_META_TAGS: CustomMeta = {
	title: "Ramune",
	description: "Watch anime together with your friends.",
	image_url: "https://ramune.gizmo.moe/logo.png"
};

export default {
	namespaced: true,
	state () {
		return {
			connectError: "",
			shouldDisplayHanyuu: Math.floor(Math.random() * 40) === 34,
			meta: { ...DEFAULT_META_TAGS }
		};
	},
	mutations: {
		UPDATE_CONNECT_ERROR (state: GenericState, message: string) {
			state.connectError = message;
		},
		UPDATE_META_TAGS (state: GenericState, meta: InputCustomMeta) {
			
			const finalMetaTags = { ...DEFAULT_META_TAGS };
			
			// Overwrite defaults
			Object.assign(finalMetaTags, meta);

			state.meta = finalMetaTags;
		}
	},
	getters: {
		meta (state: GenericState): CustomMeta {
			return state.meta;
		}
	}
} as Module<GenericState, unknown>;