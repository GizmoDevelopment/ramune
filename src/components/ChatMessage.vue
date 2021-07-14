<template>
	<div v-if="repeating">
		<div class="message-container">
			<MarkdownRenderer class="lonely-message-content" :content="message.content" />
		</div>
	</div>
	<div v-else>
		<div class="message-container">
			<img class="message-author-avatar" :src="message.user.avatar_url">
			<MarkdownRenderer class="message-content" :content="message.content" />
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

<style scoped>

	.message-container {
		display: flex;
		flex-direction: row-reverse;
		justify-content: flex-start;
		align-items: flex-start;
		margin-top: .5rem;
	}

	.message-container * {
		pointer-events: auto;
	}

	.message-author-avatar {
		border-radius: 50%;
		width: 35px;
		height: 35px;
		margin-left: 11px;
	}

	.lonely-message-content {
		margin-right: calc(35px + 11px);
	}

	.message-content, .lonely-message-content {
		position: relative;
		max-width: 100%;
		padding: .5rem .7rem .5rem .7rem;
		background-color: var(--container-background-color);
		border-radius: var(--popup-border-radius);
		text-align: left;
		overflow-wrap: break-word;
		word-break: break-word;
		white-space: break-spaces;
		hyphens: auto;
	}

	.message-content:before {
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

</style>

<style>

	.message-container .emoji {
		height: 1.4em;
		margin-top: -.2em;
	}

</style>