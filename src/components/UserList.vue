<template>
	<div class="user-list">
		<transition-group name="user-list">
			<div
				v-for="user in users"
				:key="user.id"
				v-memo="[ host, typingUserList.includes(user.id) ]"
				v-tooltip="tooltips && user.username || false"
				class="user"
				:class="{ host: isHost(user) }"
			>
				<img
					class="flavorable user-avatar"
					:class="{ typing: typingUserList.includes(user.id) }"
					:src="user.avatar_url"
					:alt="`${user.username}'s profile picture`"
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
			},
			tooltips: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			typingUserList (): number[] {
				return this.$store.state.room.typingUserList;
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

	@import "@styles/main.scss";
	@import "@styles/animations.scss";

	// Transitions

	.user-list-enter-active,
	.user-list-leave-active {
		transition: opacity .4s ease-in-out, transform .4s ease-in-out;
	}

	.user-list-enter-from,
	.user-list-leave-to {
		opacity: 0;
		transform: translateY(.5rem);
	}

	//

	.user-list-move {
		transition: transform .3s ease;
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
		width: auto;
		height: calc(100% - 6px);
		border: 3px solid variable(primary-color);
	}

	.typing {
		animation: jumping 1s ease-in-out infinite;
	}

</style>