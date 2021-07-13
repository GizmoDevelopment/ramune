<template>
	<span class="content">
		<template v-for="(snippet, index) in messageSnippets" :key="index">
			<template v-if="typeof snippet === 'string'">
				{{ snippet }}
			</template>
			<template v-else-if="snippet?.type === 'emoji'">
				<img
					class="emoji"
					:src="`https://cdn.gizmo.moe/assets/emoji/${ snippet.name }.png`"
					draggable="false"
				>
			</template>
		</template>
	</span>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Variables
	const emojis = [
		"Soulless",
		"AHHA",
		"HyperAHHA"
	];

	// Types
	interface Emoji {
		type: "emoji";
		name: string;
	}

	export default defineComponent({
		name: "Emoji",
		props: {
			content: {
				type: String,
				required: true
			}
		},
		computed: {
			messageSnippets (): Array<string | Emoji> {

				const
					_snippets: Array<string | Emoji> = [],
					rawSnippets = this.content.split(" ");

				rawSnippets.forEach((snippet: string, index: number) => {

					if (emojis.includes(snippet)) {
						_snippets.push({
							type: "emoji",
							name: snippet
						});
					} else {
						_snippets.push(snippet);
					}

					if (index !== (rawSnippets.length - 1)) {
						_snippets.push(" ");
					}
				});

				return _snippets;
			}
		}
	});

</script>

<style scoped>

	.content {
		font-size: 1em;
	}

	.emoji {
		width: auto;
		height: 19px;
		display: inline-block;
		vertical-align: top;
	}

</style>