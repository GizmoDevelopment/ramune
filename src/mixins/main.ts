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
		teleportToElement (element: HTMLElement, parent: string) {

			const parentElement = document.getElementById(parent);

			if (parentElement) {
				parentElement.appendChild(element);
			}
		}
	}
});