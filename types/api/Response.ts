export type Response<T> = SuccessResponse<T> | FailedResponse;
export type FailedResponse = { error: string };
export type SuccessResponse<T> = { data: T };
