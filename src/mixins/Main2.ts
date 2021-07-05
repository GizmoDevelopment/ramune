// Modules
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		theme: {
			type: String,
			default: "light"
		}
	},
	methods: {
		teleportToElement (element: HTMLElement, parent: HTMLElement) {
			parent.appendChild(element);
		}
	}
});