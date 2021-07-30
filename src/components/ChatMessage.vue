<template>
	<div v-if="repeating">
		<div class="message-container">
			<MarkdownRenderer class="message-content repeating-message-content" :content="message.content" />
		</div>
	</div>
	<div v-else>
		<div class="message-container">
			<img class="message-author-avatar" :src="message.user.avatar_url">
			<MarkdownRenderer class="message-content first-message-content" :content="message.content" />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import MarkdownRenderer from "@renderers/Markdown.vue";

	// Types
	import { Message } from "@typings/message";

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

	@import "@styles/mixins.scss";

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

	.first-message-content:before {
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

	.message-container {

		.emoji {
			height: 1.375em;
		}

		img, video {
			max-width: 100%;
			height: auto;
		}
	}

</style>