// Modules
import { Store } from "vuex";

// Types
import { AuthenticatedUser } from "gizmo-api/lib/types";
import { Show, ShowHusk } from "@typings/show";
import { Room } from "@typings/room";

export interface State {
    shows: Map<string, Show>;
	cachedShowList: ShowHusk[];
	user: AuthenticatedUser | null;
	room: Room | null;
	roomVideoTeleportParent: string | null;
}

declare module "@vue/runtime-core" {

    export interface State {
        shows: Map<string, Show>;
		cachedShowList: ShowHusk[];
		user: AuthenticatedUser | null;
		room: Room | null;
		roomVideoTeleportParent: string | null;
    }

    interface ComponentCustomProperties {
        $store: Store<State>;
    }

}