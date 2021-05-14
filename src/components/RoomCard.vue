<template>
	<div id="container">
		<div id="title-bar">
			<h2 id="room-name">{{ room.name }}</h2>
			<button class="button">
				<CaretRight />
			</button>
		</div>
		<div id="user-container">
			<div v-for="user in room.users" :key="user.id">
				<img
					class="user-avatar"
					:class="{ host: isHost(user) }"
					:src="user.avatar_url"
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Icons
	import CaretRight from "@assets/icons/caret-right.svg";

	// Types
	import { Room } from "@typings/room";
	import { User } from "gizmo-api/lib/types";

	export default defineComponent({
		name: "RoomCard",
		components: {
			CaretRight
		},
		props: {
			room: {
				type: Object as PropType<Room>,
				required: true
			}
		},
		methods: {
			isHost (user: User) {
				return user.id === this.room.host.id;
			}
		}
	});

</script>

<style scoped>

	#container {
		width: 400px;
		background-color: var(--background-color);
		border-radius: var(--popup-border-radius);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		padding: .75em;
	}

	#title-bar {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1em;
	}

	#room-name {
		margin-top: 0;
		margin-bottom: 0;
	}

	.user-avatar {
		border-radius: 100%;
		height: 3em;
		width: 3em;
	}

	.host {
		border: 2px solid var(--primary-color);
	}

	@media only screen and (max-width: 600px) {
		
		#container {
			width: 300px;
		}

		#room-name {
			font-size: 1em;
		}

	}

</style>