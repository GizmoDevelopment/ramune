// Types
import { Episode, Season, Show } from "@typings/show";

export function getEpisodeById (show: Show, episodeId: number): Episode | null {

	let _episode: Episode | null = null;

	for (const { episodes } of show.seasons) {

		if (_episode) break;

		for (const episode of episodes) {
			if (episode.id === episodeId) {
				_episode = episode;
				break;
			}
		}
	}

	return _episode;
}

export function getRelativeEpisodeId (season: Season, episode: Episode): number {
	return season.episodes.indexOf(episode) + 1;
}

export function getSeasonFromEpisode (show: Show, episode: Episode): Season | null {

	let _season: Season | null = null;

	for (const season of show.seasons) {
		if (season.episodes.includes(episode)) {
			_season = season;
			break;
		}
	}

	return _season;
}