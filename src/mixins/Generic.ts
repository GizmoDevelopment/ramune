// Modules
import { defineComponent } from "vue";

// Types
import { Flavor } from "@typings/main";

export default defineComponent({
	props: {
		variant: {
			type: String,
			default: "light"
		}
	},
	computed: {
		flavor (): Flavor {
			return this.$store.getters["settings/flavor"];
		}
	}
});
