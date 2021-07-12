<template>
	<div id="user-list">
		<transition-group name="user-list">
			<div
				v-for="user in users"
				:key="user.id"
				class="user"
				:class="{ host: isHost(user) }"
			>
				<img
					v-tooltip="user.username"
					class="user-avatar"
					:src="user.avatar_url"
				>
			</div>
		</transition-group>
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

	.user-list-enter-active,
	.user-list-leave-active {
		transition: opacity .4s ease-in-out, transform .4s ease-in-out;
	}

	.user-list-enter-from,
	.user-list-leave-to {
		opacity: 0;
		transform: translateY(20px);
	}

	#user-list {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		height: 3rem;
	}

	.user {
		margin-left: -6px;
	}

	.user:first-child {
		margin-left: 0;
	}

	.user-avatar {
		border-radius: 50%;
		width: 3rem;
		height: 3rem;
	}

	.host .user-avatar {
		border: 2px solid var(--primary-color);
		width: calc(3rem - 4px);
		height: calc(3rem - 4px);
	}

</style>