<template>
	<div class="message-container">
		<transition name="fade-message-avatar">
			<img
				v-if="!repeating"
				class="message-author-avatar"
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
	import { defineComponent, PropType } from "vue";

	// Components
	import MarkdownRenderer from "@renderers/Markdown.vue";

	// Types
	import type { Message } from "@typings/message";

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
		}
	});

</script>

<style scoped lang="scss">

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

		* {
			pointer-events: auto;
		}
	}

	.message-author-avatar {
		width: 35px;
		height: 35px;
		margin-left: 11px;
		border-radius: 50%;
	}

	.message-content {

		@include text-wrap;

		position: relative;
		max-width: 100%;

		background-color: var(--container-background-color);

		padding: .5rem .7rem .5rem .7rem;
		border-radius: var(--popup-border-radius);

		text-align: left;

		&.first-message-content::before {
			content: "";
			position: absolute;
			right: -5px;
			width: 0;
			height: 0;
			top: .55rem;
			border: .5rem solid transparent;
			border-left-color: var(--container-background-color);
			border-right: 0;
		}

		&.repeating-message-content {
			margin-right: calc(35px + 11px);
		}
	}

</style>

<style lang="scss">

	// stylelint-disable-next-line no-duplicate-selectors
	.message-container {

		.emoji {
			height: 1.375em;
		}

		img,
		video {
			max-width: 100%;
			height: auto;
		}
	}

</style>