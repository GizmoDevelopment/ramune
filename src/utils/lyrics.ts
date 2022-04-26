// Modules
import axios from "axios";

// Utils
import { convertTimestampToSeconds } from "@utils/essentials";

// Types
import type { Lyrics } from "@typings/show";
import type { ParsedLyrics } from "@typings/lyrics";

export async function formatLyrics (lyrics: Lyrics): Promise<ParsedLyrics> {

	const
		{ data: rawLyrics } = await axios.get<string>(lyrics.url),
		_lyrics: ParsedLyrics = {
			id: lyrics.id,
			title: "",
			artist: "",
			length: 0,
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

					_lyrics.length = convertTimestampToSeconds(lineValue);

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
			_lyrics.lines.push({
				// Make lyrics appear a bit sooner than when they're actually sang (-300ms)
				start: Math.max(0, convertTimestampToSeconds(`${lineName}:${lineValue}`) - .3),
				content: line.match(/\](.*)/)?.[1] || ""
			});
		}

	});

	// For KaraokeRenderer to properly traverse the lines while matching timestamps
	_lyrics.lines = _lyrics.lines.reverse();

	return _lyrics;
}