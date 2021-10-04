// Types
import { Theme } from "@typings/main";

export const THEMES: Record<string, Theme> = {
	blueberry: {
		primary: "hsl(200, 90%, 60%)",
		primaryHover: "hsl(200, 90%, 40%)"
	},
	strawberry: {
		primary: "hsl(0, 90%, 60%)",
		primaryHover: "hsl(0, 90%, 40%)"
	},
	lime: {
		primary: "hsl(100, 90%, 45%)",
		primaryHover: "hsl(100, 90%, 35%)"
	},
	grape: {
		primary: "hsl(288, 90%, 45%)",
		primaryHover: "hsl(288, 90%, 35%)"
	}
};

export const INPUT_ELEMENTS = [ "SPAN", "INPUT", "TEXTAREA" ];