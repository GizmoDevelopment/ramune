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