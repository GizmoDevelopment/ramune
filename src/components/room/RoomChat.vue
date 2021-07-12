<template>
	<div ref="chatContainer">
		<div id="overlay" ref="chat">
			<div id="chat-container">
				<div id="chat-message-container">
					<transition-group name="message-fade">
						<div v-for="(message, index) in messages" :key="message.id">
							<div v-if="messages[index - 1]?.user?.id === message.user.id">
								<ChatMessage :message="message" repeating />
							</div>
							<div v-else>
								<ChatMessage :message="message" />
							</div>
						</div>
					</transition-group>
				</div>
				<form
					id="chat-input-container"
					:class="{ 'hidden-chat-input-container': isFullscreen && !isFocusedOnInput }"
					@submit.prevent="sendMessage"
				>
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
						@focus="isFocusedOnInput = true"
						@blur="isFocusedOnInput = false"
					/>
					<button class="primary-button icon-button" type="submit">
						<ArrowUp />
					</button>
				</form>
			</div>
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
	import MainMixin from "@mixins/Main";
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
		mixins: [ MainMixin, RoomMixin ],
		setup () {

			const
				input = ref<HTMLTextAreaElement>(),
				chat = ref<HTMLDivElement>(),
				chatContainer = ref<HTMLDivElement>();

			return {
				input,
				chat,
				chatContainer
			};
		},
		data () {
			return {
				messageContent: "",
				messages: [] as Message[],
				allowInput: true,
				isFullscreen: false,
				isFocusedOnInput: false
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

					this.$nextTick(() => {
						if (input) input.style.height = Math.max(36, input.scrollHeight) + "px";
					});
				}
			}
		},
		mounted () {
			document.addEventListener("keydown", this.handleKey);
			document.addEventListener("fullscreenchange", this.teleportToVideo);
		},
		beforeUnmount () {
			document.removeEventListener("keydown", this.handleKey);
			document.removeEventListener("fullscreenchange", this.teleportToVideo);
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
								this.pushMessageToHistory(res.data);
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
								this.isFocusedOnInput = true;

								this.$nextTick(() => {
									if (input) input.focus();
								});
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
			},
			teleportToVideo () {
				if (this.chat && this.chatContainer) {

					const fullscreenElement = document.fullscreenElement;

					if (fullscreenElement) { // Started
						this.teleportToElement(this.chat, fullscreenElement as HTMLElement);
					} else { // Ended
						this.teleportToElement(this.chat, this.chatContainer);
					}

					this.isFullscreen = fullscreenElement !== null;
				}
			},
			pushMessageToHistory (msg: Message) {
				if (this.messages.length >= 20) {
					this.messages = [ ...this.messages.slice(-19), msg ];
				} else {
					this.messages.push(msg);
				}
			}
		},
		sockets: {
			"ROOM:MESSAGE" (msg: Message) {
				this.pushMessageToHistory(msg);
			}
		}
	});

</script>

<style scoped>

	.message-fade-leave-active,
	.message-fade-enter-active {
		transition: opacity .4s ease, transform .3s ease;
	}

	.message-fade-leave-to {
		opacity: 0;
	}

	.message-fade-enter-from {
		opacity: 0;
		transform: translateY(.5rem);
	}

	#overlay {
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		position: fixed;
		pointer-events: none;
		z-index: 1;
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
		transition: opacity .3s ease;
		opacity: 1;
	}

	#chat-input-container button {
		margin-left: 5px;
	}

	#chat-input {
		flex: 1;
		min-height: 36px;
		font-size: 1rem;
		padding: .4rem .6rem .4rem .6rem;
		resize: none;
		overflow: hidden;
		margin: 0;
	}

	.hidden-chat-input-container {
		opacity: 0 !important;
	}

</style>