<template>
	<div ref="chat" class="chat-overlay">
		<div class="chat-container">
			<div class="chat-message-container">
				<transition-group name="message-transition">
					<ChatMessage
						v-for="(message, index) in messages"
						:key="message.id"
						v-memo="[ messages[index - 1]?.user?.id === message.user.id ]"
						:message="message"
						:repeating="messages[index - 1]?.user?.id === message.user.id"
					/>
				</transition-group>
			</div>
			<form
				class="chat-input-container"
				:class="{ 'hidden-chat-input-container': isFullscreen && !isFocusedOnInput }"
				@submit.prevent="sendMessage"
			>
				<textarea
					ref="input"
					v-model="messageContent"
					class="input chat-input"
					:placeholder="$t('descriptions/chat_box')"
					maxlength="500"
					cols="28"
					rows="1"
					spellcheck="true"
					wrap="hard"
					:disabled="!allowInput"
					@focus="isFocusedOnInput = true"
					@blur="isFocusedOnInput = false"
				/>
				<button
					class="primary-button icon-button"
					:class="{ 'spinning-button': isMessageSending }"
					type="submit"
				>
					<Arrow class="send-icon" />
				</button>
			</form>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, ref } from "vue";
	import { FastAverageColor } from "fast-average-color";

	// Components
	import ChatMessage from "@components/room/ChatMessage.vue";

	// Icons
	import Arrow from "@assets/icons/arrow.svg?component";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Utils
	import { INPUT_ELEMENTS } from "@utils/constants";

	// Types
	import type { SocketResponse } from "@typings/main";
	import type { Message } from "@typings/message";
	import type { User } from "gizmo-api";

	interface UserColors {
		[key: string]: string;
	}

	export default defineComponent({
		name: "RoomChat",
		components: {
			ChatMessage,
			Arrow
		},
		mixins: [ RoomMixin ],
		setup () {

			const
				input = ref<HTMLTextAreaElement>(),
				chat = ref<HTMLDivElement>();

			return {
				input,
				chat
			};
		},
		data () {
			return {

				messages: [] as Message[],
				pingSound: new Audio("/ping.mp3"),

				// User Colors
				fac: new FastAverageColor(),
				userColors: {} as UserColors,
				userColorCleanup: 0,

				// Input
				allowInput: true,
				messageContent: "",

				// States
				isFullscreen: false,
				isFocusedOnInput: false,
				isMessageSending: false
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
			},
			isFocusedOnInput (state: boolean) {

				const eventName = state
					? "CLIENT:START_TYPING"
					: "CLIENT:STOP_TYPING";

				this.$socket.client.emit(eventName);
			}
		},
		mounted () {
			document.addEventListener("keydown", this.handleKey);
			document.addEventListener("fullscreenchange", this.updateFullscreenState);
		},
		beforeUnmount () {
			document.removeEventListener("keydown", this.handleKey);
			document.removeEventListener("fullscreenchange", this.updateFullscreenState);
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
						this.isMessageSending = true;
						this.messageContent = "";

						this.$socket.client.emit("CLIENT:SEND_MESSAGE", { content }, (res: SocketResponse<Message>) => {

							if (res.type === "success") {
								this.pushMessageToHistory(res.data);
							} else {
								console.error(res.message);
							}

							this.allowInput = true;
							this.isMessageSending = false;
						});
					}
				}
			},
			handleKey (e: KeyboardEvent) {

				const { input } = this;

				if (input) {
					switch (e.key) {
						case "/":

							if (!(document.activeElement && INPUT_ELEMENTS.includes(document.activeElement.tagName))) {

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
			updateFullscreenState () {

				const fullscreenElement = document.fullscreenElement;

				this.isFullscreen = !!fullscreenElement;
			},
			pushMessageToHistory (msg: Message) {

				if (this.messages.length >= 20) {
					this.messages = [ ...this.messages.slice(-19), msg ];
				} else {
					this.messages.push(msg);
				}

				// Automatically delete message after 30s
				setTimeout(() => {
					if (this?.messages) {
						this.messages = this.messages.filter(message => message.id !== msg.id);
					}
				}, 30000);

				// Save user's dominant color
				if (!this.userColors[msg.user.username]) {
					this.cacheUserColor(msg.user);
				}
			},
			ping () {
				if (!document.hasFocus()) {
					(this.pingSound.cloneNode(false) as HTMLAudioElement).play();
				}
			},
			async cacheUserColor (user: User) {
				
				const color = await this.fac.getColorAsync(user.avatar_url);
				
				if (color) {
					this.userColors[user.username] = color.hex;
				}
			},
			}
		},
		sockets: {
			"ROOM:MESSAGE" (msg: Message) {

				this.pushMessageToHistory(msg);
				this.ping();

				if (Notification.permission === "granted" && !document.hasFocus()) {
					new Notification(msg.user.username, {
						body: msg.content,
						icon: msg.user.avatar_url,
						silent: true
					});
				}
			}
		}
	});

</script>

<style scoped lang="scss">

	// Transitions

	.message-transition-leave-active {
		transition: opacity .7s ease-out, transform .7s ease-out;
	}

	.message-transition-enter-active {
		transition: opacity .4s ease, transform .3s ease;
	}

	.message-transition-leave-to {
		opacity: 0;
		transform: translateY(-1rem);
	}

	.message-transition-enter-from {
		opacity: 0;
		transform: translateY(.5rem);
	}

	.message-transition-move {
		transition: transform .2s ease-in-out;
	}

	// Chat Window

	.chat-overlay {
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		position: fixed;
		pointer-events: none;
		z-index: 4;
	}

	.chat-container {

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

		* {
			position: relative;
		}
	}

	@media only screen and (max-width: 420px) {
		.chat-container {
			width: calc(100% - 1rem);
			height: calc(100% - .5rem);
			height: 65%;
			top: 35%;
			padding: 0 .5rem .5rem .5rem;
		}
	}

	.chat-message-container,
	.chat-input-container {
		width: 100%;
	}

	.chat-message-container {
		margin-bottom: 1rem;
	}

	// Chat Input

	.chat-input-container {

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-end;
		pointer-events: auto;
		transition: opacity .3s ease;
		opacity: 1;

		button {

			margin-left: 10px;

			&.spinning-button {
				animation: spinning 1s ease-in-out infinite;
			}
		}
	}

	.chat-input {
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
		pointer-events: none !important;

		* {
			pointer-events: none;
		}

	}

	.send-icon {
		transform: rotateZ(-90deg);
	}

</style>