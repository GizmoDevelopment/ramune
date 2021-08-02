// Types
import { Episode, Show } from "@typings/show";

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