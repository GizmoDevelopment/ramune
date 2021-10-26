export function saveSetting (name: string, value: unknown): void {
	window.localStorage.setItem(name, JSON.stringify(value));
}

export function getSetting <T> (name: string, defaultValue: T): T {

	const setting = window.localStorage.getItem(name);

	if (setting !== null) {
		return JSON.parse(setting);
	} else {
		return defaultValue;
	}
}

export function removeSetting (name: string): void {
	window.localStorage.removeItem(name);
}