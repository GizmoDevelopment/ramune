// Types
import { Module } from "vuex";
import { Show, ShowHusk } from "@typings/show";
import { CacheState } from "@typings/shims-vuex";
import { ParsedLyrics } from "@typings/lyrics";

export default {
	namespaced: true,
	state () {
		return {
			shows: new Map(),
			showList: [],
			parsedLyrics: new Map(),
		};
	},
	mutations: {
		CACHE_SHOW (state: CacheState, show: Show) {
			state.shows.set(show.id, show);
		},
		CACHE_SHOW_LIST (state: CacheState, showList: ShowHusk[]) {
			state.showList = showList;
		},
		CACHE_PARSED_LYRICS (state: CacheState, { showId, lyrics }: { showId: string, lyrics: ParsedLyrics }) {
			state.parsedLyrics.set(`${showId}-${lyrics.id}`, lyrics);
		},
		REPLACE_SHOW_CACHE (state: CacheState, newShowCache: Map<string, Show>) {
			state.shows = newShowCache;
		},
		REPLACE_PARSED_LYRICS_CACHE (state: CacheState, newParsedLyricsCache: Map<string, ParsedLyrics>) {
			state.parsedLyrics = newParsedLyricsCache;
		}
	}
} as Module<CacheState, any>;