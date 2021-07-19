<template>
	<div class="user-list">
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
		name: "UserList",
		props: {
			users: {
				type: Array as PropType<User[]>,
				default: () => []
			},
			host: {
				type: Object as PropType<User | null>,
				default: null
			}
		},
		methods: {
			isHost (user: User) {
				return user.id === this.host?.id;
			}
		}
	});

</script>

<style scoped lang="scss">

	.user-list-enter-active,
	.user-list-leave-active {
		transition: opacity .4s ease-in-out, transform .4s ease-in-out;
	}

	.user-list-enter-from,
	.user-list-leave-to {
		opacity: 0;
		transform: translateY(20px);
	}

	.user-list {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		height: 3rem;
	}

	.user {

		height: 100%;
		margin-left: -6px;

		&:first-child {
			margin-left: 0;
		}

		.user-avatar {
			border-radius: 50%;
			width: auto;
			height: 100%;
		}
	}

	.host .user-avatar {
		border: 2px solid var(--primary-color);
		width: auto;
		height: calc(100% - 4px);
	}

</style>