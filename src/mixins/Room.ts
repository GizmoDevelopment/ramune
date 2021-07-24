// Modules
import { defineComponent, PropType } from "vue";

// Utils
import { getEpisodeById } from "@utils/show";

// Types
import { AuthenticatedUser } from "gizmo-api/lib/types";
import { Room } from "@typings/room";
import { Episode, Show } from "@typings/show";

export default defineComponent({
	props: {
		room: {
			type: Object as PropType<Room>,
			required: true
		}
	},
	computed: {
		user (): AuthenticatedUser | null {
			return this.$store.state.user;
		},
		episode (): Episode | null {
			return this.show
				? getEpisodeById(this.show, this.episodeId)
				: null;
		},
		episodeId (): number {
			return this.room.data?.episodeId || 1;
		},
		show (): Show | null {
			return this.room.data?.show || null;
		},
		isHost (): boolean {
			return this.room.host.id === this.user?.id;
		},
		isViewingRoom (): boolean {
			return this.$route.path.match(/^\/rooms\/.+$/i) !== null;
		}
	},
	methods: {
		toggleRoomControllerState (state: string | null) {
			this.$store.commit("UPDATE_ROOM_CONTROLLER_STATE", state);
		}
	}
});