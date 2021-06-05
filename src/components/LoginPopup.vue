<template>
	<PopupCard
		:visible="visible"
		title="Login"
		@dismiss="$emit('dismiss')"
	>
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
			<button class="primary-button" name="login">Log in</button>
		</div>
	</PopupCard>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import PopupCard from "@components/PopupCard.vue";

	export default defineComponent({
		name: "LoginPopup",
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
		data () {
			return {
				username: "",
				password: ""
			};
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