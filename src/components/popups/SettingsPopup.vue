<template>
	<Popup
		:visible="visible"
		:title="$t('labels/settings')"
		@dismiss="$emit('dismiss')"
	>
		<div class="setting">
			<span class="heading setting-title">{{ $t("labels/flavor") }}</span>
			<span class="setting-description flavor-description">{{ $t("descriptions/setting_flavor") }}</span>
			<div class="flavor-grid">
				<button
					v-for="(colors, name) in flavors"
					:key="name"
					v-memo="[ flavorName === name, currentLanguage ]"
					class="button flavor-button"
					:class="{ 'selected-flavor': flavorName === name }"
					:style="{ backgroundColor: colors.primary }"
					@click="setFlavor(name)"
				>
					<span class="flavor-name">{{ $t(`flavors/${name}`) }}</span>
				</button>
			</div>
		</div>
		<div class="setting">
			<span class="heading setting-title">{{ $t("labels/experience") }}</span>
			<span class="setting-description">{{ $t("descriptions/setting_experience") }}</span>
			<div class="experience-list">
				<div class="experience-toggle">
					<span class="experience-title">{{ $t("labels/video_effects") }}</span>
					<Toggle v-model="isLeafEnabled" />
				</div>
				<div class="experience-toggle">
					<span class="experience-title">{{ $t("labels/karaoke") }}</span>
					<Toggle v-model="isKaraokeEnabled" />
				</div>
				<div class="experience-toggle">
					<span class="experience-title">{{ $t("labels/splash_background") }}</span>
					<Toggle v-model="isSplashBackgroundEnabled" />
				</div>
			</div>
		</div>
		<div class="setting">
			<span class="heading setting-title">{{ $t("labels/language") }}</span>
			<div class="language-selector">
				<span class="current-language-name">{{ $t("meta/name") }}</span>
				<Dropdown
					class="language-dropdown"
					:items="languageList"
					:current-index="currentLanguageIndex"
					@select-index="setLanguageByIndex"
				>
					<template #default="slotProps">
						<MarkdownRenderer class="language-flag" :content="languageFlagList[slotProps.key]" />
					</template>
				</Dropdown>
			</div>
		</div>
	</Popup>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import Popup from "@components/popups/Popup.vue";
	import Toggle from "@components/Toggle.vue";
	import Dropdown from "@components/Dropdown.vue";

	// Renderers
	import MarkdownRenderer from "@renderers/Markdown.vue";

	// Utils
	import { FLAVORS } from "@utils/constants";

	export default defineComponent({
		name: "SettingsPopup",
		components: {
			Popup,
			Toggle,
			Dropdown,
			MarkdownRenderer
		},
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		emits: [ "dismiss" ],
		computed: {
			flavors () {
				return FLAVORS;
			},
			flavorName (): string {
				return this.$store.state.settings.flavor;
			},
			isLeafEnabled: {
				get () {
					return this.$store.state.settings.effects;
				},
				set (value: boolean) {
					this.$store.commit("settings/UPDATE_EFFECTS_STATE", value);
				}
			},
			isKaraokeEnabled: {
				get () {
					return this.$store.state.settings.karaoke;
				},
				set (value: boolean) {
					this.$store.commit("settings/UPDATE_KARAOKE_STATE", value);
				}
			},
			isSplashBackgroundEnabled: {
				get () {
					return this.$store.state.settings.splashBackground;
				},
				set (value: boolean) {
					this.$store.commit("settings/UPDATE_SPLASH_BACKGROUND_STATE", value);
				}
			},
			currentLanguage (): string {
				return this.$store.state.settings.language;
			},
			languageFlagList (): string[] {
				return Object.values(this.$store.state.cache.languages).map(lang => lang.meta.flag);
			},
			languageList (): string[] {
				return Object.keys(this.$store.state.cache.languages);
			},
			currentLanguageIndex (): number {
				return this.languageList.indexOf(this.currentLanguage);
			}
		},
		methods: {
			setFlavor (flavorName: string) {
				this.$store.commit("settings/UPDATE_FLAVOR", flavorName);
			},
			setLanguageByIndex (index: number) {
				this.$store.commit("settings/UPDATE_LANGUAGE", this.languageList[index]);
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main";

	.setting {

		width: 400px;
		padding: .8rem;
		margin-bottom: .5rem;

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

			&.flavor-description {
				margin-bottom: .5rem;
			}
		}

	}

	@media only screen and (max-width: 500px) {
		.setting {
			width: 98%;
		}
	}

	// Flavor

	.flavor-grid {
		width: 100%;
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: flex-start;
	}

	.flavor-button {

		position: relative;
		width: 4em;
		height: 2em;

		margin: .2em;
		padding: .5em;
		margin-top: 1.5em;
		border: 3px solid transparent;

		display: flex;
		align-content: center;
		justify-content: center;

		transition: border-color .2s ease, transform .25s ease;

		.flavor-name {

			position: absolute;
			top: -1em;
			width: 200%;
			left: -50%;

			font-size: 1rem;
			text-align: center;
			opacity: 0;

			user-select: none;

			transition: transform .25s ease, opacity .2s ease;
		}

		&:hover {

			transform: translateY(-.2rem);

			.flavor-name {
				transform: translateY(-.6em);
				opacity: 1;
			}
		}

		&.selected-flavor {
			border-color: variable(text-color);
		}
	}

	// Experience

	.experience-list {

		width: 100%;
		display: flex;
		flex-direction: column;

		.experience-title {
			font-weight: bold;
		}

		.experience-toggle {
			flex: 1;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: .3rem 0 .3rem 0;
		}
	}

	// Language

	.language-selector {

		width: 100%;
		display: inline-flex;
		justify-content: space-between;
		align-items: center;

		.current-language-name {
			font-weight: bold;
		}

		.language-dropdown {
			font-size: .6rem;
		}
	}

	.language-flag {
		font-size: 1.5rem;
		display: inline-flex;
		align-content: center;
	}

</style>
