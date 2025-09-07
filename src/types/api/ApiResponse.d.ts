export interface IApiResponse<T = any> {
    success: boolean;
    data: T | null;
    message: string | null;
    code: number;
}