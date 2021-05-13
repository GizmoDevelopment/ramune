// Types
import { Episode, Show } from "@typings/show";

export function getEpisodeById (show: Show, episodeId: number): Episode | null {
	
	let _episode: Episode | null = null;

	show.seasons.forEach(({ episodes }) => {
		episodes.forEach((episode: Episode) => {
			if (episode.id === episodeId) {
				_episode = episode;
			}
		});
	});

	return _episode;
}