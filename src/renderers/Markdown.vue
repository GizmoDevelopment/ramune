<template>
	<!-- Everything the users input is sanitized on the server already, so dw -->
	<span
		ref="text"
		class="content"
		v-html="formattedMessage"
	/>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, ref } from "vue";

	// Utils
	import { renderTwemoji } from "@utils/dom";

	// Variables
	const emojis = [
		"Soulless",
		"AHHA",
		"HyperAHHA",
		"Cheers",
		"Style",
		"TrollSuccess",
		"TrollVoid",
		"Scrotum",
		"Shaft",
		"Tip",
		"Booba",
		"GizmoHeart",
		"NotSad",
		"Agony",
		"NoBooba",
		"Bruh",
		"GizmoMusic",
		"GizmoMoyai",
		"Ramune",
		"Troll",
		"RikaCheers"
	];
	const emojiReplacer = new RegExp(`(${emojis.join("|")})`, "g");

	export default defineComponent({
		name: "Markdown",
		props: {
			content: {
				type: String,
				required: true
			},
			markdown: {
				type: Boolean,
				default: true
			}
		},
		setup () {

			const text = ref<HTMLSpanElement>();

			return {
				text
			};
		},
		computed: {
			formattedMessage (): string {

				let _content = this.content;

				// Custom Emoji
				_content = _content.replace(emojiReplacer, "<img class='emoji' src='https://cdn.gizmo.moe/assets/emoji/$1.png' draggable='false' alt='$1 emoji'>");

				if (this.markdown) {
					_content = _content
						.replace(/(\*\*(.*)\*\*)/g, "<b>$2</b>")
						.replace(/(\*(.*)\*)/g, "<i>$2</i>")
						.replace(/(_(.*)_)/g, "<u>$2</u>")
						.replace(/(~~(.*)~~)/g, "<s>$2</s>");
				}

				return _content;
			}
		},
		updated () {
			if (this.text) renderTwemoji(this.text);
		},
		mounted () {
			if (this.text) renderTwemoji(this.text);
		}
	});

</script>

<style lang="scss">

	.emoji {
		display: inline-block;
		vertical-align: middle;
		width: auto;
		min-width: 1em;
		height: 1em;
	}

</style>