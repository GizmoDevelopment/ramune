// Modules
import { defineComponent } from "vue";

// Types
import { AuthenticatedUser } from "gizmo-api/lib/types";
import { Room } from "@typings/room";

export default defineComponent({
	props: {
		theme: {
			type: String,
			default: "light"
		}
	},
	computed: {
		user (): AuthenticatedUser | null {
			return this.$store.state.user.user;
		},
		room (): Room | null {
			return this.$store.state.room.room;
		}
	}
});