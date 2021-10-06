// Types
import { Flavor } from "@typings/main";

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
	}
};

export const INPUT_ELEMENTS = [ "SPAN", "INPUT", "TEXTAREA" ];