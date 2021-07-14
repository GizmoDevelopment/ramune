<template>
	<!-- Everything the users input is sanitized on the server already, so dw -->
	<span class="content" v-html="formattedMessage" />
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Variables
	const emojis = [
		"Soulless",
		"AHHA",
		"HyperAHHA",
		"Cheers",
		"Style",
		"TrollSuccess",
		"Scrotum",
		"Shaft",
		"Tip"
	];
	const emojiReplacer = new RegExp(`(${emojis.join("|")})`, "g");

	export default defineComponent({
		name: "Markdown",
		props: {
			content: {
				type: String,
				required: true
			}
		},
		computed: {
			formattedMessage (): string {
				return this.content
					.replace(emojiReplacer, "<img class='emoji' src='https://cdn.gizmo.moe/assets/emoji/$1.png' draggable='false'>")
					.replace(/(\*\*(.*)\*\*)/g, "<b>$2</b>")
					.replace(/(\*(.*)\*)/g, "<i>$2</i>")
					.replace(/(_(.*)_)/g, "<u>$2</u>")
					.replace(/(~~(.*)~~)/g, "<s>$2</s>");
			}
		}
	});

</script>

<style>

	.emoji {
		width: auto;
		height: 1em;
		display: inline-block;
		vertical-align: middle;
	}

</style>