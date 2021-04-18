<template>
	<header>
		<div id="content">
			<div id="navigation">
				<router-link to="/">
					<Logo class="logo" />
				</router-link>
				<router-link to="/shows">
					Shows
				</router-link>
				<router-link to="/rooms">
					Rooms
				</router-link>
			</div>
			<div id="login">
				<button class="primary-button">
					Log In
				</button>
			</div>
		</div>
	</header>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Icons
	import Logo from "@assets/icons/Logo.svg";

	export default defineComponent({
		name: "Header",
		components: {
			Logo
		}
	});

</script>

<style scoped>

	header {
		position: sticky;
		width: 100%;
		height: 60px;
		background-color: var(--container-background-color);
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	a {
		color: var(--text-color);
		text-decoration: none;
		font-size: 20px;
	}

	#content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	@media only screen and (min-width: 1420px) {
		#content {
			width: 1420px;
		}
	}

	@media only screen and (max-width: 1420px) {
		#content {
			width: 100%;
			padding-left: 20px;
			padding-right: 20px;
		}
	}

	#navigation, #login {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	#navigation a {
		margin: 15px;
		margin-right: 15px;
		position: relative;
	}

	/* Underline every anchor label except for the logo, which has the href for root path */
	#navigation a:not([href="/"])::after {
		content: "";
		background-color: var(--text-color);
		position: absolute;
		height: 1px;
		bottom: -1px;
		width: 0;
		left: 50%;
		transition: .2s width ease-in-out, .2s left ease-in-out;
	}

	#navigation a:hover::after {
		width: 100%;
		left: 0%;
	}

	.logo {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 25px;
	}

</style>