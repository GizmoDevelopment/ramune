<template>
	<Header />
	<div id="content-container">
		<div id="content">
			<router-view v-slot="{ Component }">
				<transition name="fade-view" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";
	import { getAuthenticatedUser } from "gizmo-api";

	// Utils
	import { getCookie } from "@utils/essentials";

	// Components
	import Header from "@components/Header.vue";

	export default defineComponent({
		name: "App",
		components: {
			Header
		},
		async mounted () {

			let token = getCookie("GIZMO_TOKEN");

			if (token) {

				try {
					
					token = decodeURIComponent(token);

					const user = await getAuthenticatedUser(token);

					this.$store.commit("UPDATE_USER", { ...user, token });

				} catch (err) {
					console.error(err);
				}

			}
		}
	});

</script>

<style>

	:root {

		/* Colors */
		--text-color: white;
		--container-background-color: #1C1C1C;
		--background-color: #101010;
		--primary-color: #60C2F1;
		--primary-hover-color: #4886a3;
		--transparent-hover-color: rgba(28, 28, 28, .5);

		/* Values */
		--card-border-radius: 3px;

	}

	body {
		margin: 0;
		background-color: var(--background-color);
	}

	#content-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	@media only screen and (min-width: 1200px) {
		#content {
			width: 1200px;
		}
	}

	@media only screen and (max-width: 1200px) {
		#content {
			width: 100%;
			padding-left: 30px;
			padding-right: 30px;
		}
	}

	.fade-view-enter-active, .fade-view-leave-active {
		transition: all .3s ease;
	}

	.fade-view-enter-from, .fade-view-leave-to {
		opacity: 0;
		transform: translateY(2em);
	}

	.primary-button {
		background-color: var(--primary-color);
		color: var(--text-color);
		border: 0;
		border-radius: 10px;
		padding: 5px;
		padding-left: 20px;
		padding-right: 20px;
		font-size: 18px;
		font-weight: 500;
		transition: .2s background-color ease-in-out;
	}

	.primary-button:hover {
		background-color: var(--primary-hover-color);
	}

	.heading {
		font-size: 45px;
		font-weight: bold;
		text-align: left;
	}

	.icon {
		height: 1em;
	}

	.icon path {
		fill: var(--text-color);
	}

	.anchor-without-decoration {
		text-decoration: none;
		color: inherit;
	}

	.hover-container {
		transition: .2s background ease-out;
		border-radius: var(--card-border-radius);
	}

	.hover-container:hover {
		background-color: var(--transparent-hover-color);
	}

	#app {
		font-family: Roboto, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: var(--text-color);
	}

	@media only screen and (max-width: 800px) {
		.heading {
			font-size: 30px;
		}
	}

</style>