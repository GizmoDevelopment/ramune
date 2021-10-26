// Types
import type { Range } from "@typings/main";

export function formatTimestamp (timestamp: number): string {

	if (isNaN(timestamp) || timestamp === 0) return "0:00";

	let _timestamp = timestamp;

	const hours = Math.floor(_timestamp / 3600);

	_timestamp -= hours * 3600;

	const minutes = Math.floor(_timestamp / 60);

	_timestamp -= minutes * 60;

	const seconds = Math.floor(_timestamp);

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