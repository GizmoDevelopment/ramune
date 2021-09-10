// Utils
import { createApp } from "@factories/app";

// Variables
const { app, router } = createApp();

router.isReady().then(() => {
	app.mount("#app");
});