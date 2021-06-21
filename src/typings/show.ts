export interface ShowHusk {
    id: string;
    title: string;
	description: string;
    poster_url: string;
}

export interface Show extends ShowHusk {
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
	data: EpisodeData;
}

export interface EpisodeData {
	effects: EpisodeEffect[];
}

export interface EpisodeEffect {
	renderer: "tsparticles" | "leaf";
	data: any;
	start: number;
	end: number;
}