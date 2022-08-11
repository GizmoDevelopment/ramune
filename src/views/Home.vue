<template>
	<div>
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<h1 class="heading">{{ $t("views/home") }}</h1>
		<div v-if="$socket.connected" class="online-user-list-container">
			<h3 class="heading">{{ $t("labels/online_users") }}</h3>
			<div v-if="onlineUsers.length > 0" class="online-user-list">
				<div
					v-for="user in onlineUsers"
					:key="user.id"
					class="online-user"
				>
					<img
						class="user-avatar"
						:src="user.avatar_url"
						:alt="`${ user.username }'s profile picture`"
					>
					<span class="user-name">{{ user.username }}</span>
				</div>
			</div>
			<h3 v-else class="faded">{{ $t("descriptions/no_one_online") }}</h3>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Mixins
	import SocketMixin from "@mixins/Socket";

	// Types
	import type { User } from "gizmo-api";
	import type { SocketResponse } from "@typings/main";

	export default defineComponent({
		name: "Home",
		mixins: [ SocketMixin ],
		data () {
			return {
				onlineUsers: [] as User[],
				onlineUsersFetcherInterval: 0
			};
		},
		mounted () {

			this.fetchOnlineUsers();

			this.onlineUsersFetcherInterval = window.setInterval(() => {
				this.fetchOnlineUsers();
			}, 5000);

		},
		beforeUnmount () {
			clearInterval(this.onlineUsersFetcherInterval);
		},
		methods: {
			fetchOnlineUsers () {
				this.$socket.client.emit("CLIENT:FETCH_ONLINE_USERS", (res: SocketResponse<User[]>) => {
					if (res.type === "success") {
						this.onlineUsers = res.data;
					} else {
						console.error(res.message);
					}
				});
			}
		}
	});

</script>

<style scoped lang="scss">

	.online-user-list-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.online-user-list {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.online-user {

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin: .3rem 0 .3rem 0;

		.user-avatar {
			width: auto;
			height: 2.5rem;
			border-radius: 50%;
		}

		.user-name {
			font-size: 1.5rem;
			margin-left: .5rem;
		}
	}

</style>