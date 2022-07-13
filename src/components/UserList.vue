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
					host: isHost(user),
					typing: typingUserList.includes(user.id)
				}"
			>
				<img
					class="flavorable user-avatar"
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
	import type { User } from "gizmo-api";

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

	@import "@styles/components/UserList";

</style>