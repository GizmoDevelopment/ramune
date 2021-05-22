<template>
	<div id="user-list">
		<div v-for="user in users" :key="user.id">
			<img
				class="user-avatar"
				:class="{ host: isHost(user) }"
				:src="user.avatar_url"
			>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Types
	import { User } from "gizmo-api/lib/types";

	export default defineComponent({
		name: "RoomUserList",
		props: {
			users: {
				type: Array as PropType<User[]>,
				required: true
			},
			host: {
				type: Object as PropType<User>,
				required: true
			}
		},
		methods: {
			isHost (user: User) {
				return user.id === this.host.id;
			}
		}
	});

</script>

<style scoped>

	#user-list {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.user-avatar {
		border-radius: 100%;
		height: 3em;
		width: 3em;
		margin-left: -6px;
	}

	.host {
		border: 2px solid var(--primary-color);
	}

</style>