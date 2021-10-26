// Modules
import { defineComponent } from "vue";

// Types
import type { AuthenticatedUser } from "gizmo-api/lib/types";
import type { Room } from "@typings/room";

export default defineComponent({
	computed: {
		user (): AuthenticatedUser | null {
			return this.$store.state.user.user;
		},
		room (): Room | null {
			return this.$store.state.room.room;
		},
		isHost (): boolean {
			return this.room?.host?.id === this.user?.id;
		}
	}
});