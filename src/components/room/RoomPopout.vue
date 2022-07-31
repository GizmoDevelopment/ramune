<template>
	<div class="popout-container">
		<div class="popout-information">
			<UserList
				class="user-list"
				:tooltips="false"
				:users="room.users"
				:host="room.host"
			/>
		</div>
		<div class="popout-content">
			<!-- This is where RoomController will teleport the video element to -->
			<div v-show="room.data" id="video-popout-container" />
			<div v-show="!room.data" class="no-video-message-container">
				<p class="faded no-select">{{ $t("descriptions/host_wait") }}</p>
			</div>
		</div>
		<div class="overlay hover-opacity">
			<button class="primary-button" @click="returnToRoom()">Return</button>
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
			this.$store.commit("room/UPDATE_ROOM_CONTROLLER_STATE", "video-popout-container");
		},
		methods: {
			returnToRoom () {
				this.$router.push(`/rooms/${this.room.id}`);
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main";

	// Variables
	$popout-width: 350px;
	$popout-height: calc($popout-width * (9 / 16));

	//

	.popout-container {

		position: relative;
		background-color: variable(container-background-color);
		border-radius: variable(popup-border-radius);
		box-shadow: 0 0 10px variable(primary-color);
		width: $popout-width;
		height: $popout-height;

		.popout-information {

			position: relative;
			width: 100%;
			height: 100%;
			padding: 5px;
			z-index: 2;

			.user-list {
				height: 2em;
			}
		}

		.popout-content {

			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			display: flex;
			justify-content: center;

			#video-popout-container,
			.no-video-message-container {
				position: relative;
				width: inherit;
				height: inherit;
				display: flex;
				justify-content: center;
				align-items: center;
				z-index: 1;
			}
		}

		.overlay {
			border-radius: variable(popup-border-radius);
			z-index: 3;
			cursor: default;
		}
	}

	@media only screen and (max-width: 800px) {

		$popout-width: 250px;
		$popout-height: calc($popout-width * (9 / 16));

		.popout-container {

			width: $popout-width;
			height: $popout-height;

			.popout-information .user-list {
				height: 1.5em;
			}
		}
	}

</style>

<style lang="scss">

	// stylelint-disable no-descending-specificity
	#video-popout-container {

		// Fixes non-16:9 videos strecthing outside the pop-out
		div {
			width: auto;
			height: 100%;
		}

		// Adds round corners to pop-out video
		video {
			border-radius: var(--popup-border-radius);
		}
	}

</style>