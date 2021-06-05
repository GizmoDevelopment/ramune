<template>
	<PopupCard
		:visible="visible"
		title="Login"
		@dismiss="$emit('dismiss')"
	>
		<Error v-show="error" :text="error" />
		<div id="form">
			<input
				v-model="username"
				class="input-dark"
				type="text"
				name="username"
				placeholder="Username / E-mail"
			>
			<input
				v-model="password"
				class="input-dark"
				type="password"
				name="password"
				placeholder="Password"
			>
			<button
				class="primary-button"
				name="login"
				@click="attemptLogin()"
			>
				Log in
			</button>
		</div>
	</PopupCard>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";
	import { login } from "gizmo-api";

	// Mixins
	import Socket from "@mixins/Socket";

	// Components
	import PopupCard from "@components/PopupCard.vue";
	import Error from "@components/Error.vue";

	export default defineComponent({
		name: "LoginPopup",
		components: {
			PopupCard,
			Error
		},
		mixins: [ Socket ],
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
				error: ""
			};
		},
		methods: {
			async attemptLogin () {

				const
					username = this.username.trim(),
					password = this.password.trim();

				this.error = "";

				if (username.length > 0 && password.length > 0) {
					try {

						const user = await login(username, password);

						this.login(user);
						this.$emit("dismiss");

					} catch (err) {
						this.error = err.message;
					}
				} else {
					this.error = "Empty fields";
				}
			}
		}
	});

</script>

<style scoped>

	#form {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#form * {
		margin-top: .5em;
	}
	
	#form input {
		width: 90%;
	}

	.input {
		font-size: 1.2em;
	}

</style>