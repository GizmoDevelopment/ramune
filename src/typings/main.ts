declare global {

	interface Window {
		twemoji: {
			parse (element: HTMLElement, options?: TwemojiOptions): void;
		};
	}

	interface Document {
		webkitExitFullscreen?: () => Promise<void>;
	}

	interface HTMLElement {
		webkitRequestFullscreen?: () => Promise<void>;
		webkitEnterFullscreen?: () => Promise<void>;
	}

}

interface TwemojiOptions {
	callback?: (icon: string, options: TwemojiCallbackOptions) => string;
	attributes?: () => Record<string, unknown>;
	base?: string;
	ext?: ".png" | ".svg" | string;
	className?: string;
	size?: string | number;
	folder?: string;
}

interface TwemojiCallbackOptions {
	base: string;
	size: string;
	ext: string;
}

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

export type SocketResponse<T> = SuccessResponse<T> | ErrorResponse;

export type Range = [ number, number ];