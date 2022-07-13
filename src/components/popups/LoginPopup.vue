<template>
	<Popup
		:visible="visible"
		:title="$t('labels/login')"
		@dismiss="$emit('dismiss')"
	>
		<Error :v-show="error" :text="error" />
		<form class="form" @submit.prevent="attemptLogin">
			<Input
				v-model="username"
				variant="dark"
				type="text"
				name="username"
				:label="$t('inputs/username_and_email')"
				:autofocus="true"
			/>
			<Input
				v-model="password"
				variant="dark"
				type="password"
				name="password"
				:label="$t('inputs/password')"
			/>
			<LoadingBuffer v-if="isBusy" size="small" />
			<button
				v-else
				class="primary-button"
				:class="{ 'disabled': isLoginButtonDisabled }"
				name="login"
				@click="attemptLogin()"
			>
				{{ $t("actions/log_in") }}
			</button>
		</form>
	</Popup>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";
	import { login } from "gizmo-api";

	// Mixins
	import MainMethodsMixin from "@mixins/MainMethods";

	// Components
	import Popup from "@components/popups/Popup.vue";
	import Error from "@components/Error.vue";
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import Input from "@components/Input.vue";

	// Types
	import type { ErrorResult } from "gizmo-api";

	export default defineComponent({
		name: "LoginPopup",
		components: {
			Popup,
			Error,
			LoadingBuffer,
			Input
		},
		mixins: [ MainMethodsMixin ],
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		emits: [ "dismiss" ],
		data () {
			return {
				username: "",
				password: "",
				error: "",
				isBusy: false
			};
		},
		computed: {
			isLoginButtonDisabled (): boolean {
				return (this.username.trim().length === 0 || this.password.trim().length === 0) || this.isBusy;
			}
		},
		methods: {
			async attemptLogin () {

				if (this.isLoginButtonDisabled)
					return;

				const
					username = this.username.trim(),
					password = this.password.trim();

				if (!this.isBusy) {

					this.error = "";

					if (username.length > 0 && password.length > 0) {

						this.isBusy = true;

						try {

							const user = await login(username, password);

							this.login(user);
							this.$emit("dismiss");

						} catch (err: unknown) {

							console.error(err);

							if (typeof err === "object") {

								const error = (err as ErrorResult).message.replace(/\.$/, "");

								switch (error) {
									case "Invalid credentials":
										this.error = this.$t("errors/invalid_credentials");
										break;
									default:
										this.error = error;
								}
							}
						}

						this.isBusy = false;

					} else {
						this.error = this.$t("errors/empty_fields");
					}

				}
			}
		}
	});

</script>

<style scoped lang="scss">

	.form {

		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		*:not(button) {
			width: 100%;
		}

		button {
			margin-top: .5em;
		}
	}

</style>