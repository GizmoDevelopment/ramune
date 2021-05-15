<template>
	<div v-if="room">
		{{ room.name }}
	</div>
	<div v-else-if="status">
		<Error :text="status" />
	</div>
	<div v-else>
		<LoadingBuffer />
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import Error from "@components/Error.vue";

	// Types
	import { Room } from "@typings/room";
	import { SuccessResponse, ErrorResponse } from "@typings/index";

	export default defineComponent({
		name: "Room",
		components: {
			LoadingBuffer,
			Error
		},
		props: {
			roomId: {
				type: String,
				required: true
			}
		},
		data () {
			return {
				room: null as Room | null,
				status: ""
			};
		},
		async mounted () {

			if (this.$store.state.room) {
				this.room = this.$store.state.room;
			} else {
				this.$socket.emit("client:join_room", this.roomId, (res: SuccessResponse<Room> | ErrorResponse) => {
					if (res.type === "success") {
						this.room = res.data;
					} else {
						this.status = res.message;
					}
				});
			}

		}
	});

</script>
