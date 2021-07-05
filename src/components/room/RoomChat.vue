<template>
	<div id="overlay">
		<div id="chat-container">
			<div id="chat-message-container">
				<div v-for="(message, index) in messages" :key="index">
					<div v-if="messages[index - 1]?.user?.id === message.user.id">
						<ChatMessage :message="message" repeating />
					</div>
					<div v-else>
						<ChatMessage :message="message" />
					</div>
				</div>
			</div>
			<form id="chat-input-container" @submit.prevent="sendMessage">
				<textarea
					id="chat-input"
					ref="input"
					v-model="messageContent"
					class="input"
					placeholder="Click here or press '/' to start typing"
					maxlength="500"
					cols="28"
					rows="1"
					spellcheck="true"
					wrap="hard"
					:disabled="!allowInput"
				/>
				<button class="primary-button icon-button" type="submit">
					<ArrowUp />
				</button>
			</form>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, ref } from "vue";

	// Components
	import ChatMessage from "@components/ChatMessage.vue";

	// Icons
	import ArrowUp from "@assets/icons/arrow-up.svg?component";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Types
	import { SocketResponse } from "@typings/main";
	import { Message } from "@typings/message";

	export default defineComponent({
		name: "RoomChat",
		components: {
			ChatMessage,
			ArrowUp
		},
		mixins: [ RoomMixin ],
		setup () {

			const input = ref<HTMLTextAreaElement>();

			return {
				input
			};
		},
		data () {
			return {
				messageContent: "",
				messages: [] as Message[],
				allowInput: true
			};
		},
		computed: {
			shouldMessageInputPlaceholderBeVisible (): boolean {
				return this.messageContent.length === 0;
			}
		},
		watch: {
			messageContent () {

				const { input } = this;

				if (input) {
					input.style.height = "0px";
					input.style.height = Math.max(33, input.scrollHeight) + "px";
				}
			}
		},
		mounted () {
			document.addEventListener("keydown", this.handleKey);
		},
		beforeUnmount () {
			document.removeEventListener("keydown", this.handleKey);
		},
		methods: {
			prepareMessage () {
				this.input?.blur();
				this.sendMessage();
			},
			sendMessage () {

				const
					{ input } = this,
					content = this.messageContent.trim();

				if (input) {

					input.blur();

					if (content.length > 0) {

						this.allowInput = false;
						this.messageContent = "";

						this.$socket.emit("CLIENT:SEND_MESSAGE", { content }, (res: SocketResponse<Message>) => {

							if (res.type === "success") {
								this.messages.push(res.data);
								input.style.height = "0px"; // Dirty fix, because sometimes the input won't resize (?)
							} else {
								console.error(res.message);
							}

							this.allowInput = true;
						});
					}
				}
			},
			handleKey (e: KeyboardEvent) {

				const { input } = this;

				if (input) {
					switch (e.key) {
						case "/":

							if (document.activeElement !== input) {
								e.preventDefault();
								input.focus();
							}

							break;
						case "Enter":

							if (document.activeElement === input) {
								e.preventDefault();
								this.sendMessage();
							}

							break;
						default:
					}
				}
			}
		},
		sockets: {
			"ROOM:MESSAGE" (msg: Message) {
				this.messages.push(msg);
			}
		}
	});

</script>

<style scoped>

	#overlay {
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		position: fixed;
		pointer-events: none;
		z-index: 1337;
	}

	#chat-container {
		position: absolute;
		bottom: 0;
		right: 0;
		padding-right: 1rem;
		padding-bottom: 1rem;
		width: 370px;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	#chat-container * {
		position: relative;
	}

	#chat-message-container, #chat-input-container {
		width: 100%;
	}

	#chat-message-container {
		margin-bottom: 1rem;
	}

	#chat-input-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-end;
		pointer-events: auto;
	}

	#chat-input-container button {
		margin-left: 5px;
	}

	#chat-input {
		flex: 1;
		min-height: 33px;
		font-size: 1rem;
		padding: .4rem .6rem .4rem .6rem;
		resize: none;
		overflow: hidden;
	}

</style>