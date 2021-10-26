// Modules
import { defineComponent } from "vue";

// Utils
import { getEpisodeById, getSeasonFromEpisode } from "@utils/show";

// Types
import type { PropType } from "vue";
import type { AuthenticatedUser } from "gizmo-api/lib/types";
import type { Room } from "@typings/room";
import type { Episode, Show, Season } from "@typings/show";

export default defineComponent({
	props: {
		room: {
			type: Object as PropType<Room>,
			required: true
		}
	},
	computed: {
		user (): AuthenticatedUser | null {
			return this.$store.state.user.user;
		},
		episodeId (): number {
			return this.room.data?.episodeId || 1;
		},
		show (): Show | null {
			return this.room.data?.show || null;
		},
		season (): Season | null {
			return this.show && this.episode
				? getSeasonFromEpisode(this.show, this.episode)
				: null;
		},
		episode (): Episode | null {
			return this.show
				? getEpisodeById(this.show, this.episodeId)
				: null;
		},
		isHost (): boolean {
			return this.room.host.id === this.user?.id;
		},
		isViewingRoom (): boolean {
			return this.$route.path.match(/^\/rooms\/.+$/i) !== null;
		}
	}
});