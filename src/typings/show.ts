export interface Show {
    id: string;
    title: string;
	description: string;
    score: string;
    poster_url: string;
    seasons: Season[];
}

export interface Season {
	id: number;
    title: string;
    episodes: Episode[];
}

export interface Episode {
    id: number;
	title: string;
    thumbnail_url: string;
	subtitles: Record<string, string>;
	duration: number;
	stream_url: string;
}