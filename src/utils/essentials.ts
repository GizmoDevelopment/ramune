/**
 * @param input String to modify (e.g. "%NUM% tree%S%") -> "3 trees" | "1 tree"
 */
export function pluralize <T> (input: string, reference: T[]): string {
	return input.replace(/%NUM%/gm, reference.length.toString()).replace(/%S%/gm, reference.length === 1 ? "" : "s");
}