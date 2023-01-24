// Types
import type { LeafRendererData } from "@typings/leaf";

export interface ShowHusk {
	id: string;
	title: string;
	description: string;
	poster_url: string;
	banner_url: string;
}

export interface Show extends ShowHusk {
	format?: ShowFormat;
	seasons: Season[];
}

export interface Season {
	id: number;
	episodes: Episode[];
}

export interface Episode {
	id: number;
	title: string;
	duration: number;
	thumbnail_url: string;
	stream_url: string;
	subtitles: Subtitles[];
	data: EpisodeData;
}

export interface EpisodeData {
	effects?: LeafRendererData[];
	lyrics?: Lyrics[];
}

export interface Subtitles {
	code: string;
	language: string;
	url: string;
}

export interface Lyrics {
	id: string;
	start: number;
	url: string;
}

export type ShowFormat = "movie";

export type EpisodeChapters = EpisodeChapter[];

export interface EpisodeChapter {
	type: "op" | "ed" | "recap";
	start: number;
	end: number;
}
