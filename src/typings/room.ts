// Types
import { User } from "gizmo-api/lib/types";

export interface Room {
	id: string;
	name: string;
	host: User;
	users: User[];
	data: RoomData;
}

export type RoomData = null | {
    showId: string;
    episodeId: string;
};