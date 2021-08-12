<template>
	<PopupCard
		title="Verification"
		:visible="visible"
	>
		<div v-if="debounce">
			<LoadingBuffer class="loading-buffer" size="small" />
		</div>
		<Error
			v-if="error"
			:text="error"
		/>
		<form class="form" @submit.prevent="verifyPassword">
			<Input
				v-model="password"
				type="password"
				:limit="50"
				label="Room password"
				theme="dark"
				:autofocus="true"
			/>
		</form>
		<button
			v-if="!debounce"
			class="button primary-button"
			:class="{ 'disabled-button': isJoinButtonDisabled }"
			@click="verifyPassword"
		>
			Enter
		</button>
	</PopupCard>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import PopupCard from "@components/PopupCard.vue";
	import Input from "@components/Input.vue";
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import Error from "@components/Error.vue";

	// Mixins
	import RoomMethodsMixin from "@mixins/RoomMethods";

	// Types
	import { JoinRoomOptions } from "@typings/room";

	export default defineComponent({
		name: "RoomJoinPopup",
		components: {
			PopupCard,
			Input,
			LoadingBuffer,
			Error
		},
		mixins: [ RoomMethodsMixin ],
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			roomId: {
				type: String,
				required: true
			}
		},
		emits: [ "dismiss" ],
		data () {
			return {
				debounce: false,
				password: "",
				error: ""
			};
		},
		computed: {
			isJoinButtonDisabled (): boolean {
				return this.password.length === 0;
			}
		},
		methods: {
			verifyPassword () {

				if (this.isJoinButtonDisabled)
					return;

				this.debounce = true;

				const roomOptions: JoinRoomOptions = {
					id: this.roomId,
					password: this.password
				};

				this.joinRoom(roomOptions).then(() => {
					this.$emit("dismiss");
				}).catch(err => {
					this.debounce = false;
					this.error = err;
				});
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";

	.form {

		width: 100%;
		margin-bottom: 1rem;

		* {
			width: 100%;
		}
	}

</style>