<template>
	<header>
		<div class="content">
			<div class="navigation">
				<router-link to="/" aria-label="Home">
					<img
						v-if="shouldDisplayHanyuu"
						class="secret-logo"
						:src="Hanyuu"
					>
					<Logo v-else class="logo" />
				</router-link>
				<router-link to="/shows">
					{{ $t("views/shows") }}
				</router-link>
				<router-link to="/rooms">
					{{ $t("views/rooms") }}
				</router-link>
			</div>
			<div v-if="user" class="user-container">
				<p class="user-username">{{ user.username }}</p>
				<img
					class="user-avatar"
					:src="user.avatar_url"
					alt="Your profile picture"
				>
				<ContextMenu
					align="right"
					:items="[ 'labels/settings', 'actions/log_out' ]"
					@ctx-settings="isInSettings = !isInSettings"
					@ctx-log-out="logout"
				>
					<Caret class="more-icon" />
				</ContextMenu>
			</div>
			<div v-else class="login">
				<button class="primary-button" @click="isLoggingIn = true">
					{{ $t("actions/log_in") }}
				</button>
			</div>
		</div>
	</header>
	<div class="header-spacer" />
	<LoginPopup :visible="isLoggingIn" @dismiss="isLoggingIn = false" />
	<SettingsPopup :visible="isInSettings" @dismiss="isInSettings = false" />
</template>

<script lang="ts">

	// Modules
	import { defineAsyncComponent, defineComponent } from "vue";

	// Components
	import ContextMenu from "@components/ContextMenu.vue";

	// Mixins
	import MainMethodsMixin from "@mixins/MainMethods";

	// Async Components
	const SettingsPopup = defineAsyncComponent(() => import("@components/popups/SettingsPopup.vue"));
	const LoginPopup = defineAsyncComponent(() => import("@components/popups/LoginPopup.vue"));

	// Mixins
	import MainMixin from "@mixins/Main";

	// Icons
	import Hanyuu from "@assets/images/hanyuu.webp";
	import Logo from "@assets/icons/logo.svg?component";
	import Caret from "@assets/icons/caret.svg?component";

	export default defineComponent({
		name: "Header",
		components: {
			Logo,
			LoginPopup,
			ContextMenu,
			Caret,
			SettingsPopup
		},
		mixins: [ MainMixin, MainMethodsMixin ],
		data () {
			return {
				isLoggingIn: false,
				isInSettings: false,
				Hanyuu: Hanyuu
			};
		},
		computed: {
			shouldDisplayHanyuu (): boolean {
				return this.$store.state.generic.shouldDisplayHanyuu;
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main";

	header,
	.header-spacer {
		height: 60px;
	}

	header {

		position: fixed;
		width: 100vw;

		background-color: variable(container-background-color);

		display: flex;
		flex-direction: row;
		justify-content: center;

		z-index: 4;
	}

	a {
		color: variable(text-color);
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

	.navigation,
	.login {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.navigation {

		a {

			margin: 15px;
			margin-right: 15px;
			position: relative;

			// Underline every anchor label except for the logo, which has the href for root path
			&:not([href="/"])::after {
				content: "";
				background-color: variable(text-color);
				position: absolute;
				height: 1px;
				bottom: -1px;
				width: 0;
				left: 50%;
				transition: .2s width ease-in-out, .2s left ease-in-out;
			}

			// Underline on hover
			&:hover::after {
				width: 100%;
				left: 0%;
			}
		}

	}

	.logo {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 1.3em;
	}

	.secret-logo {
		height: 2em;
	}

	.user-container {

		display: flex;
		flex-direction: row;
		align-content: center;
		align-items: center;

		* {
			margin-left: 10px;
		}

		.more-icon {
			transform: rotateZ(90deg);
			margin-left: 0;
		}
	}

	.user-avatar {
		width: 35px;
		height: 35px;
		border-radius: 50%;
	}

</style>