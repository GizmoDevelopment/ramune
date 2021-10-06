<template>
	<PopupCard
		:visible="visible"
		title="Settings"
		@dismiss="$emit('dismiss')"
	>
		<div class="setting">
			<span class="heading setting-title">Flavor</span>
			<span class="setting-description">Changes the accent color across the website.</span>
			<div class="flavor-grid">
				<button
					v-for="(colors, name) in flavors"
					:key="name"
					v-memo="[]"
					class="button flavor-button"
					:style="{ backgroundColor: colors.primary }"
					@click="setFlavor(name)"
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
	import { FLAVORS } from "@utils/constants";

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
			flavors () {
				return FLAVORS;
			}
		},
		methods: {
			setFlavor (flavorName: string) {
				this.$store.commit("settings/UPDATE_FLAVOR", flavorName);
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

	// Flavor

	.flavor-grid {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.flavor-button {

		flex: 1;
		position: relative;
		padding: .5em;
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

</style>