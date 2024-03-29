// Types
import type { TranslateFunction } from "@plugins/i18n";

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$t: TranslateFunction;
	}
}