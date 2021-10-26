// Types
import type { User } from "gizmo-api/lib/types";
import type { Show } from "./show";

export interface PartialRoom {

	readonly id: string;
	readonly name: string;

	readonly locked: boolean;

	readonly host: User;
	readonly users: User[];
}

export interface Room {

	readonly id: string;
	readonly name: string;

	readonly locked: boolean;

	readonly host: User;
	users: User[];
	data: RoomData | null;
}

export interface RoomData {
	show: Show;
	episodeId: number;
}

export interface CreateRoomOptions {
	name: string;
	password?: string;
}

export interface JoinRoomOptions {
	id: string;
	password?: string;
}

export interface RoomSyncData {
	playing: boolean;
	currentTime: number;
}

export interface UpdatableRoomProperties {
	host?: User;
}