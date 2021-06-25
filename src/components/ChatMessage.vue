<template>
	<div v-if="repeating">
		<div class="message-container">
			<span class="lonely-message-content">{{ message.content }}</span>
		</div>
	</div>
	<div v-else>
		<div class="message-container">
			<img class="message-author-avatar" :src="message.user.avatar_url">
			<span class="message-content">{{ message.content }}</span>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Types
	import { Message } from "@typings/message";

	export default defineComponent({
		name: "ChatMessage",
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
		height: auto;
		margin-left: 1rem;
	}

	.lonely-message-content {
		margin-right: calc(35px + 1rem);
	}

	.message-content, .lonely-message-content {
		position: relative;
		background-color: var(--container-background-color);
		padding: .5rem .7rem .5rem .7rem;
		border-radius: 1.15rem;
		text-align: left;
		max-width: 100%;
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