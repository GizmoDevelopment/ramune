<template>
	<header>
		<div class="content">
			<div class="navigation">
				<router-link to="/" aria-label="Home">
					<Logo class="logo" />
				</router-link>
				<router-link to="/shows">
					Shows
				</router-link>
				<router-link to="/rooms">
					Rooms
				</router-link>
			</div>
			<div v-if="user" class="user-container">
				<p class="user-username">{{ user.username }}</p>
				<img
					class="user-avatar"
					:src="user.avatar_url"
					alt="Your profile picture"
				>
			</div>
			<div v-else>
				<div class="login">
					<button class="primary-button" @click="isLoggingIn = true">
						Log In
					</button>
				</div>
			</div>
		</div>
	</header>
	<div class="empty" />
	<LoginPopup :visible="isLoggingIn" @dismiss="isLoggingIn = false" />
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import LoginPopup from "@components/LoginPopup.vue";

	// Mixins
	import MainMixin from "@mixins/Main";

	// Icons
	import Logo from "@assets/icons/logo.svg?component";

	export default defineComponent({
		name: "Header",
		components: {
			Logo,
			LoginPopup
		},
		mixins: [ MainMixin ],
		data () {
			return {
				isLoggingIn: false
			};
		}
	});

</script>

<style scoped>

	header {
		position: fixed;
		width: 100%;
		height: 60px;
		background-color: var(--container-background-color);
		display: flex;
		flex-direction: row;
		justify-content: center;
		z-index: 4;
	}

	.empty {
		height: 60px;
		margin-bottom: 1rem;
	}

	a {
		color: var(--text-color);
		text-decoration: none;
		font-size: 20px;
	}

	.content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
		align-items: center;
	}

	@media only screen and (min-width: 1420px) {
		.content {
			width: 1420px;
		}
	}

	@media only screen and (max-width: 1420px) {
		.content {
			width: 100%;
			padding-left: 20px;
			padding-right: 20px;
		}
	}

	.navigation, .login {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.navigation a {
		margin: 15px;
		margin-right: 15px;
		position: relative;
	}

	/* Underline every anchor label except for the logo, which has the href for root path */
	.navigation a:not([href="/"])::after {
		content: "";
		background-color: var(--text-color);
		position: absolute;
		height: 1px;
		bottom: -1px;
		width: 0;
		left: 50%;
		transition: .2s width ease-in-out, .2s left ease-in-out;
	}

	.navigation a:hover::after {
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

	.user-container {
		display: flex;
		flex-direction: row;
		align-content: center;
		align-items: center;
	}

	.user-container * {
		margin-left: 10px;
	}

	.user-avatar {
		width: 35px;
		height: 35px;
		border-radius: 50%;
	}

</style>