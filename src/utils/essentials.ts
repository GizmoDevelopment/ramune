// Types
import type { Range } from "@typings/main";

export function formatTimestamp (timestamp: number): string {

	if (isNaN(timestamp) || timestamp === 0)
		return "0:00";

	const
		hours = Math.floor(timestamp / 3600),
		minutes = Math.floor(timestamp / 60) - hours * 60,
		seconds = Math.floor(timestamp % 60);

	return `${hours > 0 ? `${hours}:` : ""}${(hours > 0 && minutes < 10) ? "0" : ""}${minutes}:${seconds > 9 ? "" : 0}${seconds}`;
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

export function getRandomNumberFromRange (range: Range): number {
	return (Math.random() * (range[1] - range[0])) + range[0];
}

// https://stackoverflow.com/a/44134328
export function hslToHex (hsl: string): string {

	const match = hsl.match(/hsl\((\d+?), (\d+?)%, (\d+?)%\)/i);

	if (!match) {
		throw Error("Invalid HSL value");
	}

	const
		h = Number(match[1]),
		s = Number(match[2]),
		l = Number(match[3]) / 100;

	if (isNaN(h) || isNaN(s) || isNaN(l)) {
		throw Error("Invalid HSL value");
	}

	const a = s * Math.min(l, 1 - l) / 100;

	const f = (n: number): string => {

		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

		return Math.round(255 * color).toString(16).padStart(2, "0");
	};

	return `#${f(0)}${f(8)}${f(4)}`;
}

export async function typeFetch (method: string, url: string): Promise<string>;
export async function typeFetch<T> (method: string, url: string): Promise<T>;
export async function typeFetch<T> (method: string, url: string): Promise<T | string> {

	const response = await fetch(url, { method });

	if (response.ok) {
		if (response.headers.get("Content-Type")?.includes("application/json")) {
			return response.json() as Promise<T>;
		} else {
			return response.text();
		}
	} else {
		throw new Error(response.statusText);
	}
}
