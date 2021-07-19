<template>
	<div class="user-list">
		<transition-group name="user-list">
			<div
				v-for="user in users"
				:key="user.id"
				class="user"
				:class="{ host: isUserHost(user) }"
			>
				<template v-if="isHost">
					<ContextMenu
						:identifier="user.id"
						:items="[ 'Promote to Host', 'Kick' ]"
						@ctx-promote-to-host="userId => $emit('ctx-promote-to-host', userId)"
						@ctx-kick="userId => $emit('ctx-kick', userId)"
					>
						<img
							v-tooltip="user.username"
							class="user-avatar"
							:src="user.avatar_url"
						>
					</ContextMenu>
				</template>
				<template v-else>
					<img
						v-tooltip="user.username"
						class="user-avatar"
						:src="user.avatar_url"
					>
				</template>
			</div>
		</transition-group>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ContextMenu from "@components/ContextMenu.vue";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Types
	import { User } from "gizmo-api/lib/types";
	import { Room } from "@typings/room";

	export default defineComponent({
		name: "RoomUserList",
		components: {
			ContextMenu
		},
		mixins: [ RoomMixin ],
		props: {
			room: {
				type: Object as PropType<Room>,
				required: true
			}
		},
		emits: [ "ctx-promote-to-host", "ctx-kick" ],
		computed: {
			users (): User[] {
				return this.room.users;
			},
			host (): User {
				return this.room.host;
			}
		},
		methods: {
			isUserHost (user: User) {
				return user.id === this.host.id;
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
			width: auto;
			height: 100%;
			border-radius: 50%;
		}
	}

	.host .user-avatar {
		width: auto;
		height: calc(100% - 4px);
		border: 2px solid var(--primary-color);
	}

</style>