// Types
import { User } from "gizmo-api/lib/types";

export interface Message {
	id: string;
	user: User;
	content: string;
}