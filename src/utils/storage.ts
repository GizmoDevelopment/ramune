export function saveSetting (name: string, value: unknown): void {
	window.localStorage.setItem(name, JSON.stringify(value));
}

export function getSetting <T> (name: string, defaultValue: T): T {

	const settingValue = window.localStorage.getItem(name);

	console.log(settingValue);

	if (settingValue !== null) {
		try {
			return JSON.parse(settingValue);
		} catch (err) {

			// Might have old non-JSON settings
			try {
				return JSON.parse(JSON.stringify(settingValue));
			} catch (err) {
				return defaultValue;
			}
		}
	} else {
		return defaultValue;
	}
}

export function removeSetting (name: string): void {
	window.localStorage.removeItem(name);
}