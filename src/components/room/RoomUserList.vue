<template>
	<div class="user-list">
		<transition-group name="room-user-list">
			<div
				v-for="user in users"
				:key="user.id"
				class="user"
				:class="{ host: isUserHost(user) }"
			>
				<template v-if="isHost && user.id !== host.id">
					<ContextMenu
						:identifier="user.id"
						:items="[ 'Promote to Host', 'Kick' ]"
						@ctx-promote-to-host="promoteUserIdToHost"
						@ctx-kick="kickUserId"
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
			},
			promoteUserIdToHost (userId: number) {
				this.$emit("ctx-promote-to-host", userId);
			},
			kickUserId (userId: number) {
				this.$emit("ctx-kick", userId);
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";

	.room-user-list-enter-active,
	.room-user-list-leave-active {
		transition: opacity .4s ease-in-out, transform .4s ease-in-out;
	}

	.room-user-list-enter-from,
	.room-user-list-leave-to {
		opacity: 0;
		transform: translateY(.5rem);
	}

	.room-user-list-move {
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
			width: auto;
			height: 100%;
			border-radius: 50%;
		}
	}

	.host .user-avatar {
		width: auto;
		height: calc(100% - 6px);
		border: 3px solid variable(primary-color);
	}

</style>