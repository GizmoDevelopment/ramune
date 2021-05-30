<template>
	<h1 class="heading">{{ room.name }}</h1>
	<RoomUserList :users="room.users" :host="room.host" />
	<button class="primary-button" @click="$emit('leave-room')">Leave</button>
	<div v-if="show && episode">
		<Video
			:show="show"
			:episode="episode"
		/>
		<div v-if="isHost">
			<ShowSeasonList
				:show="show"
				:selected-episode-id="episodeId"
			/>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import RoomUserList from "@components/RoomUserList.vue";
	import Video from "@components/Video.vue";
	import ShowSeasonList from "@components/ShowSeasonList.vue";

	// Utils
	import { getEpisodeById } from "@utils/show";

	// Types
	import { Room } from "@typings/room";
	import { AuthenticatedUser } from "gizmo-api/lib/types";
	import { Show, Episode } from "@typings/show";

	export default defineComponent({
		name: "Room",
		components: {
			RoomUserList,
			Video,
			ShowSeasonList
		},
		props: {
			room: {
				type: Object as PropType<Room>,
				required: true
			}
		},
		emits: [ "leave-room" ],
		computed: {
			user (): AuthenticatedUser | null {
				return this.$store.state.user;
			},
			show (): Show | null {
				return this.room.data?.show || null;
			},
			episodeId (): number {
				return this.room.data?.episodeId || 1;
			},
			episode (): Episode | null {
				return this.show
					? getEpisodeById(this.show, this.episodeId)
					: null;
			},
			isHost (): boolean {
				return this.room.host.id === this.user?.id;
			}
		}
	});

</script>