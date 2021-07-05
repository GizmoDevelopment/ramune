<template>
	<div id="container" :theme="theme">
		<div id="title-bar">
			<h2 id="room-name">{{ room.name }}</h2>
			<button class="primary-button icon-button" @click="joinRoom()">
				<CaretRight />
			</button>
		</div>
		<RoomUserList :users="room.users" :host="room.host" />
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import RoomUserList from "@components/room/RoomUserList.vue";

	// Mixins
	import MainMixin from "@mixins/Main";

	// Icons
	import CaretRight from "@assets/icons/caret-right.svg?component";

	// Types
	import { SocketResponse } from "@typings/main";
	import { Room } from "@typings/room";

	export default defineComponent({
		name: "RoomCard",
		components: {
			CaretRight,
			RoomUserList
		},
		mixins: [ MainMixin ],
		props: {
			room: {
				type: Object as PropType<Room>,
				required: true
			}
		},
		methods: {
			joinRoom () {
				if (this.room.id !== "") { // Don't join from dummy room cards
					if (this.$store.state.room?.id === this.room.id) {
						this.$router.push(`/rooms/${ this.room.id }`);
					} else {
						this.$socket.emit("CLIENT:JOIN_ROOM", this.room.id, (res: SocketResponse<Room>) => {
							if (res.type === "success") {
								this.$store.commit("JOIN_ROOM", res.data);
								this.$router.push(`/rooms/${ res.data.id }`);
							} else {
								console.error(res.message);
							}
						});
					}
				}
			}
		}
	});

</script>

<style scoped>

	#container {
		width: 400px;
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

	@media only screen and (max-width: 600px) {

		#container {
			width: 300px;
		}

		#room-name {
			font-size: 1em;
		}

	}

</style>