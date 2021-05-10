// Types
import { Socket } from "socket.io";

declare module "@vue/runtime-core" {
	export interface ComponentCustomProperties {
		$socket: Socket;
	}
}