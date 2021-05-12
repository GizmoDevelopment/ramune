/**
 * Changes page title
 */
export function changePageTitle (title: string): void {
	console.log(title);
	document.title = title;
}

/**
 * Resets page title to default 'Ramune'
 */
export function clearPageTitle (): void {
	document.title = "Ramune";
}