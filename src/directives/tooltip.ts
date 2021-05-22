// Modules
import { Directive, DirectiveBinding } from "vue";
import tippy from "tippy.js";

// Styles
import "tippy.js/animations/shift-away.css";

export default {
	mounted (el: HTMLElement, binding: DirectiveBinding<string>) {

		tippy(el, {
			content: binding.value,
			animation: "shift-away"
		});

	}
} as Directive;