// Modules
import axios from "axios";

// Types
import { Show, ShowHusk } from "@typings/show";

// Constants
const SHOW_ENDPOINT = import.meta.env.VITE_SHOW_ENDPOINT;
const SHOW_CDN_ENDPOINT = import.meta.env.VITE_SHOW_CDN_ENDPOINT;

/**
 * Fetches all available shows
 */
export async function getShows (): Promise<ShowHusk[]> {
	try {

		const { data: response } = await axios.get(`${ SHOW_ENDPOINT }/shows`);

		if (response.type === "success" && response.data) {
			return response.data;
		} else {
			throw new Error(response.message);
		}

	} catch (err) {
		console.error(err);
		return [];
	}
}

/**
 * Fetches specified show by its ID
 */
export async function getShow (showId: string): Promise<Show|null> {
	try {

		const { data: response } = await axios.get(`${ SHOW_ENDPOINT }/shows/${ showId }`);

		if (response.type === "success" && response.data) {
			return response.data;
		} else {
			throw new Error(response.message);
		}

	} catch (err) {
		console.error(err);
		return null;
	}
}

export function getStreamURL(showId: string, episodeId: number): string {
	return `${ SHOW_CDN_ENDPOINT }/shows/${ showId }/episodes/${ episodeId }.mp4`;
}