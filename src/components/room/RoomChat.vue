<template>
	<div id="overlay">
		<div id="container">
			<div id="chat-container">
				<div v-for="(message, index) in messages" :key="index">
					<div v-if="messages[index - 1]?.user?.id === message.user.id">
						<ChatMessage :message="message" repeating />
					</div>
					<div v-else>
						<ChatMessage :message="message" />
					</div>
				</div>
			</div>
			<div id="chat-input-container">
				<span v-if="shouldMessageInputPlaceholderBeVisible" id="empty-chat-input-label">Click here or press '/' to start typing</span>
				<span
					id="chat-input"
					ref="input"
					class="input"
					role="textbox"
					contenteditable
					@input="handleChatInput"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, ref } from "vue";

	// Components
	import ChatMessage from "@components/ChatMessage.vue";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Types
	import { SocketResponse } from "@typings/main";
	import { Message } from "@typings/message";

	export default defineComponent({
		name: "RoomChat",
		components: {
			ChatMessage
		},
		mixins: [ RoomMixin ],
		setup () {

			const input = ref<HTMLSpanElement>();

			return {
				input
			};
		},
		data () {
			return {
				messageContent: "",
				messages: [] as Message[]
			};
		},
		computed: {
			shouldMessageInputPlaceholderBeVisible (): boolean {
				return this.messageContent.length === 0;
			}
		},
		mounted () {
			document.addEventListener("keydown", this.handleKey);
		},
		beforeUnmount () {
			document.removeEventListener("keydown", this.handleKey);
		},
		methods: {
			handleChatInput (e: InputEvent) {
				if (e.inputType === "insertParagraph") { // Enter
					if (this.input) {

						// Prevent paragraph line-breaking
						this.input.textContent = this.messageContent;
						this.input.blur();

						this.sendMessage();
					}
				} else {
					this.messageContent = (e.target as HTMLSpanElement)?.textContent?.slice(0, 300) || "";
				}
			},
			sendMessage () {
				if (this.input) {

					const content = this.messageContent;

					if (content.trim().length > 0) {

						this.input.textContent = "";
						this.messageContent = "";

						this.$socket.emit("CLIENT:SEND_MESSAGE", { content }, (res: SocketResponse<Message>) => {
							if (res.type === "success") {
								this.messages.push(res.data);
							} else {
								console.error(res.message);
							}
						});
					}
				}
			},
			handleKey (e: KeyboardEvent) {
				if (e.key === "/") {

					e.preventDefault();

					setTimeout(() => {
						if (this.input && document.activeElement !== this.input) {
							this.input.focus();
						}
					}, 10);
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
	}

	#container {
		position: absolute;
		bottom: 0;
		right: 0;
		padding-right: 1em;
		padding-bottom: 1em;
		width: 330px;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	#container * {
		position: relative;
		pointer-events: auto;
	}

	#chat-container, #chat-input {
		width: 100%;
	}

	#chat-container {
		margin-bottom: 1rem;
	}

	#chat-input-container span {
		padding: .4rem .6rem .4rem .6rem;
		height: auto;
		font-size: 1rem;
		display: block;
		text-align: left;
	}

	#chat-input {
		width: 100%;
		word-wrap: break-word;
	}

	#empty-chat-input-label {
		height: 100%;
		position: absolute;
		opacity: .5;
		top: 0;
		left: 0;
		z-index: 2;
		pointer-events: none;
		border: 2px solid transparent;
	}

</style>