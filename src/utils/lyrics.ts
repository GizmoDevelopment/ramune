// Utils
import { convertTimestampToSeconds, http } from "@utils/essentials";

// Types
import { Lyrics } from "@typings/show";
import { ParsedLyrics, Line } from "@typings/lyrics";

export async function formatLyrics (lyrics: Lyrics): Promise<ParsedLyrics> {

	const
		{ text: rawLyrics }= await http.get(lyrics.url),
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
				start: convertTimestampToSeconds(`${lineName}:${lineValue}`),
				content: line.match(/\](.*)/)?.[1] || ""
			});
		}

	});

	// For KaraokeRenderer to properly traverse the lines while matching timestamps
	_lyrics.lines = _lyrics.lines.reverse();

	return _lyrics;
}