<template>
	<PopupCard
		:visible="visible"
		title="Settings"
		@dismiss="$emit('dismiss')"
	>
		<div class="setting">
			<span class="heading setting-title">Theme Color</span>
			<span class="setting-description">Changes the accent color across the website.</span>
			<div class="theme-color-grid">
				<button
					v-for="(colors, name) in themes"
					:key="name"
					v-memo="[]"
					class="button theme-color-button"
					:style="{ backgroundColor: colors.primary }"
					@click="setThemeColor(name)"
				>
					{{ name }}
				</button>
			</div>
		</div>
	</PopupCard>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import PopupCard from "@components/PopupCard.vue";

	// Utils
	import { THEMES } from "@utils/constants";

	export default defineComponent({
		name: "SettingsPopup",
		components: {
			PopupCard
		},
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		emits: [ "dismiss" ],
		computed: {
			themes () {
				return THEMES;
			}
		},
		methods: {
			setThemeColor (themeName: string) {
				this.$store.commit("settings/UPDATE_THEME", themeName);
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";

	.setting {

		width: 400px;
		padding: .8rem;

		background-color: variable(background-color);
		border-radius: variable(card-border-radius);

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;

		.setting-title {
			font-size: 1.3rem;
			margin-top: 0;
			margin-bottom: .5rem;
		}

		.setting-description {
			color: variable(faded-heading-text-color);
			font-size: 1rem;
			margin-bottom: 2rem;
		}

	}

	@media only screen and (max-width: 500px) {
		.setting {
			width: 98%;
		}
	}

	// Theme Color

	.theme-color-button {

		position: relative;
		flex: 1 0 0;
		padding: .5em 1em .5em 1em;
		margin: .2em;
		font-size: 1rem;

		color: transparent;

		overflow: hidden;
		transition: color .35s ease;

		&:before {
			position: absolute;
			width: 100%;
			height: .35em;
			top: 0;
			left: 0;
			opacity: .4;
			background-color: variable(text-color);
			content: "";
		}

		&:hover {
			color: variable(text-color);
		}
	}

	.theme-color-grid {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	}

</style>