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
		name: "Emoji",
		props: {
			content: {
				type: String,
				required: true
			}
		},
		computed: {
			formattedMessage (): string {
				return this.content.replace(emojiReplacer, "<img class='emoji' src='https://cdn.gizmo.moe/assets/emoji/$1.png' draggable='false'>");
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