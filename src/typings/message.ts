// Types
import type { User } from "gizmo-api";

export interface Message {
	id: string;
	user: User;
	content: string;
}