// Modules
import axios from "axios";

// Utils
import { convertTimestampToSeconds } from "@utils/essentials";

// Types
import { Lyrics } from "@typings/show";
import { ParsedLyrics, Line } from "@typings/lyrics";

export async function formatLyrics (lyrics: Lyrics): Promise<ParsedLyrics> {

	const
		rawLyrics: string = (await axios.get(lyrics.url))?.data,
		_lyrics: ParsedLyrics = {
			id: lyrics.id,
			title: "",
			artist: "",
			start: lyrics.start,
			end: 0,
			lines: []
		};

	rawLyrics.split("\n").forEach((line: string) => {

		/**
		 * Here we parse every line and extract the values:
		 *
		 * [length:01:29.32] --> lineName = "length"; lineValue = "01:29.32"
		 * [00:09.80]PITCHED UP --> lineName = "00"; lineValue = "09.80"
		 *
		 * If the lineName is a number, then we parse it as a verse/line
		 */

		const [ , lineName, lineValue ] = line.match(/\[(.*?):(.*?)\]/) || [];

		if (isNaN(Number(lineName))) {
			switch (lineName) {
				case "length":

					_lyrics.end = _lyrics.start + convertTimestampToSeconds(lineValue);

					break;
				case "ar":

					_lyrics.artist = lineValue.trim();

					break;
				case "ti":

					_lyrics.title = lineValue.trim();

					break;
				default:
			}
		} else {

			const _line: Line = {
				start: convertTimestampToSeconds(`${lineName}:${lineValue}`),
				content: line.match(/\](.*)/)?.[1] || ""
			};

			// Ignore possible empty matches
			if (_line.content.length > 0) {
				_lyrics.lines.push(_line);
			}
		}

	});

	// For KaraokeRenderer to properly traverse the lines while matching timestamps
	_lyrics.lines = _lyrics.lines.reverse();

	return _lyrics;
}