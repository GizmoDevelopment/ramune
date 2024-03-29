export interface ParsedLyrics {
	id: string;
	title: string;
	artist: string;
	length: number;
	lines: Array<TimedLine | Line>;
}

export interface Line {
	start: number;
	content: string;
}

export interface TimedLine {
	start: number;
	content: Word[];
}

export interface Word {
	start: number;
	content: string;
}
