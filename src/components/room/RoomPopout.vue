<template>
	<div class="popout-container">
		<div class="popout-information">
			<UserList
				id="user-list"
				:tooltips="false"
				:users="room.users"
				:host="room.host"
			/>
		</div>
		<div class="popout-content">
			<!-- This is where RoomController will teleport the video element to -->
			<div v-show="room.data" id="room-video-popout-container" />
			<div v-show="!room.data" class="no-video-message-container">
				<p class="faded">Waiting for host</p>
			</div>
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
			this.$store.commit("room/UPDATE_ROOM_CONTROLLER_STATE", "room-video-popout-container");
		},
		methods: {
			returnToRoom () {
				this.$router.push(`/rooms/${this.room.id}`);
			}
		}
	});

</script>

<style lang="scss">

	#room-video-popout-container {

		div {
			width: auto;
			height: 100%;
		}

		video {
			border-radius: var(--popup-border-radius);
		}
	}

</style>

<style scoped lang="scss">

	@import "@styles/main.scss";

	.popout-container {

		position: relative;
		background-color: variable(container-background-color);
		border-radius: variable(popup-border-radius);
		box-shadow: 0 0 10px variable(primary-color);
		width: 350px;
		height: calc(350px * (9 / 16));

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

			#room-video-popout-container,
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
		}
	}

</style>