// Types
import type { Episode, Season, Show } from "@typings/show";

export function getEpisodeById (show: Show, episodeId: number): Episode | null {

	let accumulativeLength = 0;

	for (let i = 0; i <= show.seasons.length; i++) {

		const season = show.seasons[i];

		if (season) {

			const _accumulativeLength = accumulativeLength;
			accumulativeLength += season.episodes.length;

			if (episodeId <= accumulativeLength) {
				return season.episodes[episodeId - _accumulativeLength - 1];
			}
		}
	}

	return null;
}

export function getRelativeEpisodeId (season: Season, episode: Episode): number {
	return season.episodes.indexOf(episode) + 1;
}

export function getSeasonFromEpisodeId (show: Show, episodeId: number): Season | null {

	let accumulativeLength = 0;

	for (let i = 0; i <= show.seasons.length; i++) {

		const season = show.seasons[i];

		if (season) {

			accumulativeLength += season.episodes.length;

			if (episodeId <= accumulativeLength) {
				return season;
			}
		}
	}

	return null;
}

export function getSeasonFromEpisode (show: Show, episode: Episode): Season | null {
	return getSeasonFromEpisodeId(show, episode.id);
}

export function getSeasonIndexFromEpisodeId (show: Show, episodeId: number): number | null {

	const season = getSeasonFromEpisodeId(show, episodeId);

	return season
		? season.id - 1
		: null;
}