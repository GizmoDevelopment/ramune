<template>
	<div>
		<h1 class="heading">Rooms</h1>
		<div v-if="user">
			<div v-if="rooms">
				<div v-for="room in rooms" :key="room.id">
					<RoomCard :room="room" />
				</div>
			</div>
			<div v-else>
				<LoadingBuffer />
			</div>
		</div>
		<div v-else>
			<Error text="You must be logged in to view this page" />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import Error from "@components/Error.vue";
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import RoomCard from "@components/RoomCard.vue";

	// Types
	import { Room } from "@typings/room";

	export default defineComponent({
		name: "Rooms",
		components: {
			Error,
			LoadingBuffer
		},
		data () {
			return {
				rooms: null as Room[] | null
			};
		},
		computed: {
			user () {
				return this.$store.state.user;
			}
		}
	});

</script>
