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
				@click="login()"
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

	// Components
	import PopupCard from "@components/PopupCard.vue";
	import Error from "@components/Error.vue";

	// Utils
	import { setCookie } from "@utils/dom";

	export default defineComponent({
		name: "LoginPopup",
		components: {
			PopupCard,
			Error
		},
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
			async login () {

				const
					username = this.username.trim(),
					password = this.password.trim();

				this.error = "";

				if (username.length > 0 && password.length > 0) {
					try {

						const user = await login(username, password);

						setCookie("GIZMO_TOKEN", user.token);
						this.$store.commit("UPDATE_USER", { ...user, token: undefined });

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