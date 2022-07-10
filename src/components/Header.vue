<template>
	<header>
		<div class="content">
			<div class="navigation">
				<router-link
					to="/"
					class="home-button"
					aria-label="Home"
				>
					<img
						v-if="shouldDisplayHanyuu"
						class="secret-logo"
						:src="Hanyuu"
					>
					<Logo v-else class="logo" />
				</router-link>
				<template v-if="!isMobile">
					<router-link to="/shows">
						{{ $t("views/shows") }}
					</router-link>
					<router-link to="/rooms">
						{{ $t("views/rooms") }}
					</router-link>
				</template>
			</div>
			<div v-if="chosenUser" class="user-container">
				<p class="user-username">{{ chosenUser.username }}</p>
				<img
					class="user-avatar"
					:src="chosenUser.avatar_url"
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
	<div v-if="isMobile" class="mobile-navigator">
		<transition name="mobile-navigator-slide">
			<div v-if="isNavigatorOpen" class="mobile-navigator-tray">
				<router-link to="/shows" @click="isNavigatorOpen = false">
					{{ $t("views/shows") }}
				</router-link>
				<router-link to="/rooms" @click="isNavigatorOpen = false">
					{{ $t("views/rooms") }}
				</router-link>
			</div>
		</transition>
		<button
			class="button icon-button hamburger-button"
			@click="isNavigatorOpen = !isNavigatorOpen"
		>
			<transition name="mobile-navigator-pop">
				<Close v-if="isNavigatorOpen" />
				<Menu v-else />
			</transition>
		</button>
	</div>
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
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const SettingsPopup = defineAsyncComponent(() => import("@components/popups/SettingsPopup.vue"));
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const LoginPopup = defineAsyncComponent(() => import("@components/popups/LoginPopup.vue"));

	// Mixins
	import MainMixin from "@mixins/Main";

	// Icons
	import Hanyuu from "@assets/images/hanyuu.webp";
	import Logo from "@assets/icons/logo.svg?component";
	import Caret from "@assets/icons/caret.svg?component";
	import Menu from "@assets/icons/menu.svg?component";
	import Close from "@assets/icons/close.svg?component";

	export default defineComponent({
		name: "Header",
		components: {
			Logo,
			LoginPopup,
			ContextMenu,
			Caret,
			SettingsPopup,
			Menu,
			Close
		},
		mixins: [ MainMixin, MainMethodsMixin ],
		data () {
			return {
				isLoggingIn: false,
				isInSettings: false,
				isNavigatorOpen: false,
				Hanyuu: Hanyuu
			};
		},
		computed: {
			shouldDisplayHanyuu (): boolean {
				return this.$store.state.generic.shouldDisplayHanyuu;
			},
			cachedUser () {
				return this.$store.state.cache.cachedUser;
			},
			chosenUser () {
				return this.user || this.cachedUser;
			},
			isMobile () {
				return /Mobi|Android/i.test(navigator.userAgent);
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main";
	@import "@styles/mixins";

	// Transitions

	.mobile-navigator-pop-enter-from,
	.mobile-navigator-pop-leave-to {
		opacity: 0;
		transform: scale(0);
	}

	.mobile-navigator-slide-enter-from,
	.mobile-navigator-slide-leave-to {
		opacity: 0;
		transform: translateY(.2em) scale(99%);
	}

	.mobile-navigator-pop-enter-active,
	.mobile-navigator-pop-leave-active,
	.mobile-navigator-slide-enter-active,
	.mobile-navigator-slide-leave-active {
		transition: opacity .2s ease, transform .25s ease;
	}

	//

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

		.content {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-content: center;
			align-items: center;
		}
	}

	// Navigation

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

	a {
		color: variable(text-color);
		text-decoration: none;
		font-size: 20px;
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

			position: relative;
			margin: 15px;

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

	@media only screen and (max-width: 500px) {
		.home-button {
			margin-left: 0 !important;
		}
	}

	// User

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

	// Mobile Navigator

	.mobile-navigator {

		position: fixed;
		right: 1rem;
		bottom: 1rem;

		display: flex;
		flex-flow: column wrap;
		align-items: flex-end;

		z-index: 4;

		.hamburger-button,
		.mobile-navigator-tray {

			@include box-shadow;

			background: variable(container-background-color);
			border-radius: variable(popup-border-radius);
		}

		.mobile-navigator-tray {

			display: flex;
			flex-flow: column wrap;
			border: 2px solid variable(primary-color);

			a {
				padding: .3em 1.3em;
			}
		}

		.hamburger-button {

			position: relative;
			width: 3rem;
			height: 3rem;
			margin-top: 1rem;
			border: 5px solid variable(container-background-color);

			svg {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
			}
		}
	}

</style>