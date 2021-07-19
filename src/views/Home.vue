<template>
	<div>
		<h1 class="heading">Online users</h1>
		<div class="online-user-list">
			<div
				v-for="user in onlineUsers"
				:key="user.id"
				class="online-user"
			>
				<img class="user-avatar" :src="user.avatar_url">
				<span class="user-name">{{ user.username }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Utils
	import { clearPageTitle } from "@utils/dom";

	// Types
	import { User } from "gizmo-api/lib/types";
	import { SocketResponse } from "@typings/main";

	export default defineComponent({
		name: "Home",
		data () {
			return {
				onlineUsers: [] as User[]
			};
		},
		mounted () {

			clearPageTitle();

			this.$socket.emit("CLIENT:FETCH_ONLINE_USERS", (res: SocketResponse<User[]>) => {
				if (res.type === "success") {
					this.onlineUsers = res.data;
				} else {
					console.error(res.message);
				}
			});
		}
	});

</script>

<style scoped lang="scss">

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