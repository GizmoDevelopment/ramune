// Types
import { range } from "@typings/main";

interface FetchResponse {
	data: Record<string, any>;
	text: string;
}

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

	return `${minutes}:${seconds > 9 ? "" : 0}${seconds}`;
}

export function convertTimestampToSeconds (timestamp: string): number {

	let time = 0;

	timestamp.split(":").reverse().forEach((num, index) => {

		const _num = Number(num);

		if (!isNaN(_num)) {
			time += _num * Math.pow(60, index);
		}
	});

	return time;
}

async function fetchRequest (method: "GET" | "POST", url: string): Promise<FetchResponse> {

	const
		res = await fetch(url, { method }),
		text = await res.text(),
		result: FetchResponse = {
			data: {},
			text
		};

	try {
		result.data = JSON.parse(text);
	} catch {
		result.data = {};
	}

	return result;
}

export const http = {
	get (url: string): Promise<FetchResponse> {
		return fetchRequest("GET", url);
	}
};

export function getRandomNumberFromRange (range: range): number {
	return (Math.random() * (range[1] - range[0])) + range[0];
}