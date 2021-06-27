/**
 * @param input String to modify (e.g. "%NUM% tree%S%") -> "3 trees" | "1 tree"
 */
export function pluralize <T> (input: string, reference: T[]): string {
	return input.replace(/%NUM%/gm, reference.length.toString()).replace(/%S%/gm, reference.length === 1 ? "" : "s");
}

export function formatTimestamp (timestamp: number): string {

	if (isNaN(timestamp) || timestamp === 0) return "0:00";

	const
		minutes = Math.floor(timestamp / 60),
		seconds = Math.floor(timestamp - (minutes * 60));

	return `${ minutes }:${ seconds > 9 ? "" : 0 }${ seconds }`;
}