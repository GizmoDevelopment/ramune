export interface Show {
    id: string;
    title: string;
    score: string;
    poster_url: string;
    seasons: Season[];
}

export interface Season {
    title: string;
    episodes: Episode[];
}

export interface Episode {
    title: string;
    thumbnail_url: string;
}