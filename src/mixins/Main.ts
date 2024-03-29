// Modules
import { defineComponent } from "vue";

// Types
import type { AuthenticatedUser } from "gizmo-api";
import type { Room } from "@typings/room";
import type { InputCustomMeta } from "@stores/generic";

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
	},
	methods: {
		setPageMetaTags (metaTags: InputCustomMeta) {
			this.$store.commit("generic/UPDATE_META_TAGS", metaTags);
		}
	}
});