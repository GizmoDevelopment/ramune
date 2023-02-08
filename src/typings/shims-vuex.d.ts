// Types
import type { Store } from "vuex";
import type { AuthenticatedUser, User } from "gizmo-api";
import type { EpisodeChapters, Show, ShowHusk } from "@typings/show";
import type { Room } from "@typings/room";
import type { ParsedLyrics } from "@typings/lyrics";
import type { Language } from "@typings/settings";

export interface CacheState {
	shows: Map<string, Show>;
	showList: ShowHusk[];
	parsedLyrics: Map<string, ParsedLyrics>;
	languages: Record<string, Language>;
	cachedUser: User | null;
	episodeChapters: Map<string, EpisodeChapters>;
}

export interface RoomState {
	room: Room | null;
	roomVideoTeleportParent: string | null;
	isLoadingRoomData: boolean;
	typingUserList: number[];
}

export interface UserState {
	user: AuthenticatedUser | null;
}

export interface CustomMeta {
	title: string;
	description: string;
	image_url: string;
}

export interface GenericState {
	connectError: string;
	meta: CustomMeta;
	secretLogo: string | null;
}

export interface SettingsState {
	flavor: string;
	karaoke: boolean;
	effects: boolean;
	volume: number;
	language: string;
	splashBackground: boolean;
}

export interface State {
	cache: CacheState;
	room: RoomState;
	user: UserState;
	generic: GenericState;
	settings: SettingsState;
}

declare module "@vue/runtime-core" {

	interface State {
		cache: CacheState;
		room: RoomState;
		user: UserState;
		generic: GenericState;
		settings: SettingsState;
	}

	interface ComponentCustomProperties {
		$store: Store<State>;
	}

}
