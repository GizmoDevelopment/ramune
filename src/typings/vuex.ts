// Modules
import { Store } from "vuex";

// Types
import { Show } from "@typings/types";

export interface State {
    shows: Map<string, Show>;
}

declare module "@vue/runtime-core" {

    export interface State {
        shows: Map<string, Show>;
    }

    interface ComponentCustomProperties {
        $store: Store<State>;
    }

}