<template>
	<div class="message-container">
		<transition name="fade-message-avatar">
			<img
				v-if="!repeating"
				class="message-author-avatar"
				:class="{ host: isHost }"
				:src="message.user.avatar_url"
				:alt="`${ message.user.username }'s profile picture`"
			>
		</transition>
		<MarkdownRenderer
			class="message-content"
			:class="{
				'repeating-message-content': repeating,
				'first-message-content': !repeating
			}"
			:content="message.content"
		/>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, type PropType } from "vue";

	// Components
	import MarkdownRenderer from "@renderers/Markdown.vue";

	// Types
	import type { Message } from "@typings/message";
	import type { Room } from "@typings/room";

	export default defineComponent({
		name: "ChatMessage",
		components: {
			MarkdownRenderer
		},
		props: {
			message: {
				type: Object as PropType<Message>,
				required: true
			},
			repeating: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			room (): Room | null {
				return this.$store.state.room.room;
			},
			isHost (): boolean {
				return this.room ? this.room.host.id === this.message.user.id : false;
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main";
	@import "@styles/mixins";

	// Transitions

	.fade-message-avatar-enter-active,
	.fade-message-avatar-leave-active {
		transition: opacity .3s ease;
	}

	.fade-message-avatar-leave-to,
	.fade-message-avatar-enter-from {
		opacity: 0;
	}

	//

	.message-container {
		display: flex;
		flex-direction: row-reverse;
		justify-content: flex-start;
		align-items: flex-start;
		margin-top: .5rem;
	}

	.message-author-avatar {

		width: 35px;
		height: 35px;
		margin-left: 11px;
		border-radius: 50%;

		&.host {
			width: calc(35px - 6px);
			height: calc(35px - 6px);
			border: 3px solid variable(primary-color);
		}
	}

	.message-content {

		@include text-wrap;

		position: relative;
		max-width: 100%;

		background-color: variable(container-background-color);

		padding: .5rem .7rem .5rem .7rem;
		border-radius: variable(popup-border-radius);

		line-height: 1.5;

		text-align: left;
		pointer-events: auto;

		&.first-message-content::before {

			position: absolute;
			width: 0;
			height: 0;
			top: .55rem;
			right: -5px;

			border: .5rem solid transparent;
			border-left-color: variable(container-background-color);
			border-right: 0;

			content: "";
		}

		&.repeating-message-content {
			margin-right: calc(35px + 11px);
		}
	}

</style>

<style lang="scss">

	// stylelint-disable-next-line no-duplicate-selectors
	.message-content {

		.emoji {
			height: 1.3em;
		}

		// Unused, as posting images & videos is currently unsupported
		img:not([class="emoji"]),
		video {
			max-width: 100%;
			height: auto;
		}

	}

</style>
