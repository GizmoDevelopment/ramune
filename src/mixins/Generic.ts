// Modules
import { defineComponent } from "vue";

// Types
import { Theme } from "@typings/main";

export default defineComponent({
	props: {
		variant: {
			type: String,
			default: "light"
		}
	},
	computed: {
		theme (): Theme {
			return this.$store.getters["settings/theme"];
		}
	}
});