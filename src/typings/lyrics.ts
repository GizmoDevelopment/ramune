export interface FormattedLyrics {
	id: string;
	showId: string;
	start: number;
	end: number;
	lines: TimedLine|Line[];
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
