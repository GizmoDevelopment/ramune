// Modules
import { Store } from "vuex";

// Types
import { AuthenticatedUser } from "gizmo-api/lib/types";
import { Show, ShowHusk } from "@typings/show";
import { Room } from "@typings/room";
import { ParsedLyrics } from "@typings/lyrics";

export interface State {
    shows: Map<string, Show>;
	cachedShowList: ShowHusk[];
	cachedParsedLyrics: Record<string, ParsedLyrics>;
	user: AuthenticatedUser | null;
	room: Room | null;
	roomVideoTeleportParent: string | null;
	isRequestingRoomSync: boolean;
	isLoadingRoomData: boolean;
	connectError: string;
}

declare module "@vue/runtime-core" {

    export interface State {
        shows: Map<string, Show>;
		cachedShowList: ShowHusk[];
		cachedParsedLyrics: Record<string, ParsedLyrics>;
		user: AuthenticatedUser | null;
		room: Room | null;
		roomVideoTeleportParent: string | null;
		isRequestingRoomSync: boolean;
		isLoadingRoomData: boolean;
		connectError: string;
    }

    interface ComponentCustomProperties {
        $store: Store<State>;
    }

}