// Types
import type { Directive, DirectiveBinding } from "vue";

export default {
	mounted (el: HTMLElement, binding: DirectiveBinding<string>) {
		if (binding.value) {

			el.classList.add("tooltip-container");
			el.style.position = "relative";

			const tooltipContainer = document.createElement("div");
			tooltipContainer.classList.add("tooltip");

			const tooltipContent = document.createElement("div");
			tooltipContent.classList.add("tooltip-content");
			tooltipContent.innerHTML = binding.value;

			tooltipContainer.appendChild(tooltipContent);
			el.appendChild(tooltipContainer);
		}
	},
	updated (el: HTMLElement) {
		el.classList.add("tooltip-container");
	},
	beforeUnmount (el: HTMLElement) {
		el.querySelector(".tooltip-container")?.remove();
	}
} as Directive;