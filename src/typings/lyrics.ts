export interface FormattedLyrics {
	id: string;
	start: number;
	end: number;
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
