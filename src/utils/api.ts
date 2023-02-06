// Utils
import { typeFetch } from "@utils/essentials";

// Types
import type { APIResponse } from "@typings/main";
import type { EpisodeChapters, Show, ShowHusk } from "@typings/show";

// Constants
const SHOW_ENDPOINT = import.meta.env.VITE_SHOW_ENDPOINT;

/**
 * Fetches all available shows
 */
export async function getShows (): Promise<ShowHusk[]> {
	try {

		const response = await typeFetch<APIResponse<ShowHusk[]>>("get", `${SHOW_ENDPOINT}/shows`);

		if (response.type === "success") {
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
export async function getShow (showId: string): Promise<Show | null> {
	try {

		const response = await typeFetch<APIResponse<Show>>("get", `${SHOW_ENDPOINT}/shows/${showId}`);

		if (response.type === "success") {
			return response.data;
		} else {
			throw new Error(response.message);
		}

	} catch (err) {
		console.error(err);
		return null;
	}
}

export async function getEpisodeChapters (showId: string, episodeId: number): Promise<EpisodeChapters> {
	try {

		const response = await typeFetch<APIResponse<EpisodeChapters>>("get", `${SHOW_ENDPOINT}/shows/${showId}/episodes/${episodeId}/chapters`);

		if (response.type === "success") {
			return response.data;
		} else {
			throw new Error(response.message);
		}

	} catch (err) {
		console.error(err);
		return [];
	}
}
