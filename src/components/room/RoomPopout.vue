<template>
	<div id="position-container">
		<div id="container">
			<div id="room-information">
				<RoomUserList
					id="user-list"
					:users="room.users"
					:host="room.host"
				/>
			</div>
			<div id="video">
				<div v-if="room.data">
					<!-- This is where RoomVideoController will teleport the video element to -->
					<div id="room-video-popout-container" />
				</div>
				<div v-else>
					<p class="faded">Nothing is currently playing</p>
				</div>
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
	import RoomUserList from "@components/room/RoomUserList.vue";

	// Mixins
	import RoomMixin from "@mixins/Room";

	export default defineComponent({
		name: "RoomPopout",
		components: {
			RoomUserList,
		},
		mixins: [ RoomMixin ],
		mounted () {
			this.toggleRoomControllerState("room-video-popout-container");
		},
		beforeUnmount () {
			this.toggleRoomControllerState(null);
		},
		methods: {
			returnToRoom () {
				this.$router.push(`/rooms/${ this.room.id }`);
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

	#overlay, #room-video-popout-container video {
		border-radius: var(--popup-border-radius);
	}

	#overlay button:hover {
		background-color: var(--primary-color);
		cursor: pointer;
	}

</style>