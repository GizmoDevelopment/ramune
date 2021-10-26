declare global {

	interface Window {
		twemoji: Twemoji;
		SubtitlesOctopus: typeof SubtitlesOctopus;
	}

	interface Document {
		webkitExitFullscreen?: () => Promise<void>;
	}

	interface HTMLElement {
		webkitRequestFullscreen?: () => Promise<void>;
		webkitEnterFullscreen?: () => Promise<void>;
	}

}

// Twemoji (https://github.com/twitter/twemoji/blob/master/index.d.ts)

interface Twemoji {
	convert: {
		fromCodePoint (hexCodePoint: string): string;
		toCodePoint (utf16surrogatePairs: string): string;
	};
	parse (node: HTMLElement | string, options?: TwemojiOptions): void;
}

interface TwemojiOptions {

	base?: string;
	ext?: ".png" | ".svg";
	className?: string;
	size?: string | number;
	folder?: string;

	callback?: (icon: string, options: TwemojiOptions) => string;
	attributes?: () => Record<string, unknown>;
}

// JavascriptSubtitlesOctopus

export declare class SubtitlesOctopus {

	constructor (options: SubtitlesOctopusOptions);

	setTrackByUrl (url: string): void;
	setTrack (content: string): void;
	freeTrack (): void;
	dispose (): void;
	setCurrentTime (currentTime: number): void;
}

interface SubtitlesOctopusOptions {

	workerUrl: string;

	video?: HTMLVideoElement;
	canvas?: HTMLCanvasElement;
	subUrl?: string;
	subContent?: string;
	legacyWorkerUrl?: string;
	debug?: boolean;
	fonts?: string[];
	blendRender?: boolean;
}

// Responses

interface BaseResponse {
	type: "success" | "error";
	protocol?: string;
	message?: string;
}

export interface SuccessResponse<T> extends BaseResponse {
	type: "success";
	data: T;
}

export interface ErrorResponse extends BaseResponse {
	type: "error";
	message: string;
}

export type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

export type SocketResponse<T> = SuccessResponse<T> | ErrorResponse;

//

export type Range = [ number, number ];

export interface Flavor {
	primary: string;
	primaryHover: string;
}

export type Language = Record<string, Record<string, string>>;