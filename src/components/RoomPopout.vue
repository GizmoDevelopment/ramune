<template>
	<div v-if="room" id="position-container">
		<div id="container">
			<div id="room-information">
				<RoomUserList
					id="user-list"
					:users="room.users"
					:host="room.host"
				/>
			</div>
			<div id="video">
				<p class="faded">Nothing is currently playing</p>
			</div>
			<div
				id="overlay"
				class="overlay hover-opacity"
				@click="returnToRoom()"
			>
				<button class="primary-button">Return</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import RoomUserList from "@components/RoomUserList.vue";

	// Types
	import { Room } from "@typings/room";

	export default defineComponent({
		name: "RoomPopout",
		components: {
			RoomUserList
		},
		computed: {
			room (): Room | null {
				return this.$store.state.room;
			}
		},
		methods: {
			returnToRoom () {
				if (this.room) {
					this.$router.push(`/rooms/${ this.room.id }`);
				}
			}
		}
	});

</script>

<style scoped>

	#position-container {
		position: fixed;
		right: 0;
		bottom: 0;
		z-index: 10;
		margin-right: 15px;
		margin-bottom: 15px;
	}

	#container {
		position: relative;
		background-color: var(--container-background-color);
		border-radius: var(--popup-border-radius);
		width: 400px;
		height: calc(400px * 9/16);
		box-shadow: 0 0 10px var(--primary-color);
	}

	#video {
		position: absolute;
		width: inherit;
		top: 0;
		left: 0;
		height: inherit;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	#room-information {
		width: 100%;
		height: 100%;
		padding: 5px;
	}

	#user-list {
		height: 2em;
	}

	#overlay {
		border-radius: var(--popup-border-radius);
	}

	#overlay button:hover {
		background-color: var(--primary-color);
		cursor: pointer;
	}

</style>