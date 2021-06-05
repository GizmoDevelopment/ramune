// Modules
import { Store } from "vuex";

// Types
import { User } from "gizmo-api/lib/types";
import { Show } from "@typings/show";
import { Room } from "@typings/room";

export interface State {
    shows: Map<string, Show>;
	user: User | null;
	room: Room | null;
}

declare module "@vue/runtime-core" {

    export interface State {
        shows: Map<string, Show>;
		user: User | null;
		room: Room | null;
    }

    interface ComponentCustomProperties {
        $store: Store<State>;
    }

}