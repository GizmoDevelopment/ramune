<template>
	<div class="popout-container">
		<div class="room-information">
			<UserList
				id="user-list"
				:users="room.users"
				:host="room.host"
			/>
		</div>
		<!-- This is where RoomVideoController will teleport the video element to -->
		<div id="room-video-popout-container" />
		<div v-if="!room.data" class="no-video-message-container">
			<p class="faded">Waiting for host</p>
		</div>
		<div
			class="overlay hover-opacity"
			@click="returnToRoom()"
		>
			<button class="primary-button">Return</button>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import UserList from "@components/UserList.vue";

	// Mixins
	import RoomMixin from "@mixins/Room";

	export default defineComponent({
		name: "RoomPopout",
		components: {
			UserList,
		},
		mixins: [ RoomMixin ],
		mounted () {
			this.toggleRoomControllerState("room-video-popout-container");
		},
		methods: {
			returnToRoom () {
				this.$router.push(`/rooms/${ this.room.id }`);
			}
		}
	});

</script>

<style scoped lang="scss">

	.popout-container {
		position: relative;
		background-color: var(--container-background-color);
		border-radius: var(--popup-border-radius);
		box-shadow: 0 0 10px var(--primary-color);
		width: 350px;
		height: calc(350px * 9/16);
	}

	#room-video-popout-container, .no-video-message-container {
		position: absolute;
		width: inherit;
		top: 0;
		left: 0;
		height: inherit;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
		align-items: center;
		z-index: 1;
		margin-top: 2px;
	}

	.room-information {
		position: relative;
		width: 100%;
		height: 100%;
		padding: 5px;
		z-index: 2;
	}

	.user-list {
		height: 2em;
	}

	.overlay {
		border-radius: var(--popup-border-radius);
		z-index: 3;
	}

</style>

<style>

	#room-video-popout-container video {
		border-radius: var(--popup-border-radius);
	}

</style>