// Types
import type { Flavor } from "@typings/settings";

export const FLAVORS: Record<string, Flavor> = {
	blueberry: {
		primary: "hsl(200, 90%, 60%)",
		primaryHover: "hsl(200, 90%, 40%)"
	},
	strawberry: {
		primary: "hsl(0, 90%, 60%)",
		primaryHover: "hsl(0, 90%, 40%)"
	},
	watermelon: {
		primary: "hsl(100, 90%, 45%)",
		primaryHover: "hsl(100, 90%, 35%)"
	},
	grape: {
		primary: "hsl(288, 90%, 45%)",
		primaryHover: "hsl(288, 90%, 35%)"
	},
	orange: {
		primary: "hsl(17, 80%, 55%)",
		primaryHover: "hsl(17, 80%, 45%)"
	},
	cotton_candy: {
		primary: "hsl(300, 90%, 75%)",
		primaryHover: "hsl(300, 90%, 65%)"
	},
	mango: {
		primary: "hsl(40, 90%, 60%)",
		primaryHover: "hsl(40, 90%, 40%)"
	},
	cherry: {
		primary: "hsl(0, 90%, 30%)",
		primaryHover: "hsl(0, 90%, 20%)"
	}
};

export const INPUT_ELEMENTS = [ "SPAN", "INPUT", "TEXTAREA" ];