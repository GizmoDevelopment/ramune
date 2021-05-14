// Types
import { AuthenticatedUser, User } from "gizmo-api/lib/types";

export function getUserFromAuthenticatedUser (user: AuthenticatedUser): User {

	delete (user as any).token;

	return user as User;
}