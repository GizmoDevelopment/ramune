declare global {

	interface Window {
		twemoji: {
			parse (element: HTMLElement, options?: TwemojiOptions): void;
		}
	}

	interface Document {
		webkitExitFullscreen?: () => Promise<void>
	}

	interface HTMLElement {
		webkitRequestFullscreen?: () => Promise<void>
		webkitEnterFullscreen?: () => Promise<void>
	}

}

interface TwemojiOptions {
	callback?: any;
	attributes?: any;
	base?: string;
	ext?: ".png" | ".svg" | string;
	className?: string;
	size?: string | number;
	folder?: string;
}

interface BaseResponse {
	type: "success" | "error";
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