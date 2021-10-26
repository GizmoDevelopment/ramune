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
		},
		computed: {
			topMargin (): string {
				return this.repeating
					? ".5em"
					: "2em";
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/mixins";

	.fade-message-avatar-enter-active,
	.fade-message-avatar-leave-active {
		transition: .5s opacity ease;
	}

	.fade-message-avatar-leave-to,
	.fade-message-avatar-enter-from {
		opacity: 0;
	}

	.message-container {

		display: flex;
		flex-direction: row-reverse;
		justify-content: flex-start;
		align-items: flex-start;
		margin-top: v-bind(topMargin);

		* {
			pointer-events: auto;
		}
	}

	.message-author-avatar {
		border-radius: 50%;
		width: 35px;
		height: 35px;
		margin-left: 11px;
	}

	.message-content {

		@include text-wrap;

		position: relative;
		max-width: 100%;
		padding: .5rem .7rem .5rem .7rem;
		background-color: var(--container-background-color);
		border-radius: var(--popup-border-radius);
		text-align: left;
	}

	.first-message-content::before {
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

	.repeating-message-content {
		margin-right: calc(35px + 11px);
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