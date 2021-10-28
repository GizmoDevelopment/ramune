<template>
	<div class="user-list-container">
		<transition-group name="user-list">
			<div
				v-for="user in users"
				:key="user.id"
				v-memo="[ host, typingUserList.includes(user.id) ]"
				v-tooltip="tooltips && user.username || false"
				class="user"
				:class="{
					host: isUserHost(user),
					typing: typingUserList.includes(user.id)
				}"
			>
				<ContextMenu
					v-if="isHost && user.id !== host.id"
					:identifier="user.id"
					:items="[ 'actions/promote_host', 'actions/kick' ]"
					@ctx-promote-host="promoteUserIdToHost"
					@ctx-kick="kickUserId"
				>
					<img
						class="flavorable user-avatar"
						:src="user.avatar_url"
						:alt="`${user.username}'s profile picture`"
					>
				</ContextMenu>
				<img
					v-else
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

	// Components
	import ContextMenu from "@components/ContextMenu.vue";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Types
	import type { User } from "gizmo-api/lib/types";
	import type { Room } from "@typings/room";

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
			},
			tooltips: {
				type: Boolean,
				default: true
			}
		},
		emits: [ "ctx-promote-to-host", "ctx-kick" ],
		computed: {
			users (): User[] {
				return this.room.users;
			},
			host (): User {
				return this.room.host;
			},
			typingUserList (): number[] {
				return this.$store.state.room.typingUserList;
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

	@import "@styles/components/UserList";

</style>