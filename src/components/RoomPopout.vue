<template>
	<div v-if="room" id="container">
		room.name
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Types
	import { Room } from "@typings/room";

	export default defineComponent({
		name: "RoomPopout",
		computed: {
			room (): Room | null {
				return this.$store.state.room;
			}
		}
	});

</script>

<style scoped>

	#container {
		position: absolute;
		right: 0;
		bottom: 0;
	}

</style>