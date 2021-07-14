/**
 * Changes page title
 */
export function setPageTitle (title: string): void {
	document.title = title;
}

/**
 * Resets page title to default 'Ramune'
 */
export function clearPageTitle (): void {
	document.title = "Ramune";
}

export function getCookie (name: string): string | null {

	const
		cookies = document.cookie.split("; "),
		cookieMatch = new RegExp(`^${name}=`);

	const cookie = cookies.find((cookie: string) => cookie.match(cookieMatch));

	return cookie
		? decodeURIComponent(cookie.replace(`${name}=`, ""))
		: null;
}

export function setCookie (name: string, value: string): void {
	document.cookie = `${ name }=${ encodeURIComponent(value) }`;
}

export function renderTwemoji (element: HTMLElement): void {
	window.twemoji.parse(element, {
		ext: ".svg",
		folder: "twemoji",
		base: "https://cdn.gizmo.moe/assets/"
	});
}