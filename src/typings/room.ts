// Types
import { User } from "gizmo-api/lib/types";
import { Show } from "./show";

export interface Room {

	readonly id: string;
	readonly name: string;

	host: User;
	users: User[];
	data: RoomData | null;

}

export interface RoomData {
	show: Show;
	episodeId: number;
}

export interface RoomOptions {
	name: string;
}

export interface RoomSyncData {
	playing: boolean;
	currentTime: number;
}

export interface UpdatableRoomProperties {
	host?: User;
}