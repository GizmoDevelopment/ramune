/**
 * @param input String to modify (e.g. "%NUM% tree%S%") -> "3 trees" | "1 tree"
 */
export function pluralize <T> (input: string, reference: T[]): string {
	return input.replace(/%NUM%/gm, reference.length.toString()).replace(/%S%/gm, reference.length === 1 ? "" : "s");
}

export function getCookie (name: string): string | null {
	
	const
		cookies = document.cookie.split("; "),
		cookieMatch = new RegExp(`^${ name }=`);

	const cookie = cookies.find((cookie: string) => cookie.match(cookieMatch));

	return cookie
		? cookie.replace(`${ name }=`, "")
		: null;
}