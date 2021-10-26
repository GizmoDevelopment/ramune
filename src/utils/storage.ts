// ! IF YOU'RE ADDING SAVABLE OBJECTS/ARRAYS/MAPS, MAKE SURE TO STRINGIFY THEM PROPERLY

export function saveSetting (name: string, value: unknown): void {
	window.localStorage.setItem(name, `${value}`);
}

export function getSetting <T> (name: string, defaultValue: T): unknown {

	const setting = window.localStorage.getItem(name);

	if (setting !== null) {
		switch (typeof defaultValue) {
			case "number":
				return Number(setting);
			case "boolean":
				return setting === "true" ? true : false;
			default: // Strings
				return setting;
		}
	} else {
		return defaultValue;
	}
}