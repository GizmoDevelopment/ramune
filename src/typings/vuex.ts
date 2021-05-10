// Modules
import { Store } from "vuex";

// Types
import { AuthenticatedUser } from "gizmo-api/lib/types";
import { Show } from "@typings/show";

export interface State {
    shows: Map<string, Show>;
	user: AuthenticatedUser | null;
}

declare module "@vue/runtime-core" {

    export interface State {
        shows: Map<string, Show>;
		user: AuthenticatedUser | null;
    }

    interface ComponentCustomProperties {
        $store: Store<State>;
    }

}