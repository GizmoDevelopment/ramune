<template>
	<PopupCard
		:visible="visible"
		title="Login"
		@dismiss="$emit('dismiss')"
	>
		<Error :v-show="error" :text="error" />
		<form class="form" @submit.prevent="attemptLogin">
			<input
				v-model="username"
				class="input"
				variant="dark"
				type="text"
				name="username"
				placeholder="Username / E-mail"
			>
			<input
				v-model="password"
				class="input"
				variant="dark"
				type="password"
				name="password"
				placeholder="Password"
			>
			<div v-if="isBusy">
				<LoadingBuffer size="small" />
			</div>
			<div v-else>
				<button
					class="primary-button"
					name="login"
					@click="attemptLogin()"
				>
					Log in
				</button>
			</div>
		</form>
	</PopupCard>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";
	import { login } from "gizmo-api";

	// Mixins
	import SocketMixin from "@mixins/Socket";

	// Components
	import PopupCard from "@components/PopupCard.vue";
	import Error from "@components/Error.vue";
	import LoadingBuffer from "@components/LoadingBuffer.vue";

	export default defineComponent({
		name: "LoginPopup",
		components: {
			PopupCard,
			Error,
			LoadingBuffer
		},
		mixins: [ SocketMixin ],
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
		methods: {
			async attemptLogin () {

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

						} catch (err) {
							console.error(err);
							this.error = err.message;
						}

						this.isBusy = false;

					} else {
						this.error = "Empty fields";
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

		* {
			margin-top: .5em;
		}

		.input {
			width: 100%;
			font-size: 1.2em;
		}
	}

</style>