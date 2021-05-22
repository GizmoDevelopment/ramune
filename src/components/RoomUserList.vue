<template>
	<div id="user-list">
		<div
			v-for="user in users"
			:key="user.id"
			class="user"
		>
			<img
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
		height: 3em;
	}

	.user {
		height: 100%;
		margin-left: -6px;
	}

	.user:first-child {
		margin-left: 0;
	}
	
	.user img {
		border-radius: 100%;
		width: auto;
		height: 100%;
	}

	.host {
		border: 2px solid var(--primary-color);
	}

</style>