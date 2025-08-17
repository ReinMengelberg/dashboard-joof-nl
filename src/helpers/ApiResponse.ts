export interface IApiResponse<T = any> {
    success: boolean;
    data: T | null;
    message: string | null;
    code: number;
}

export class ApiResponse<T = any> implements IApiResponse<T> {
    success: boolean;
    data: T | null;
    message: string | null;
    code: number;

    constructor(success: boolean, data: T | null = null, message: string | null = null, code: number = 200) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.code = code;
    }

    static success<T>(data: T, message: string | null = null, code: number = 200): ApiResponse<T> {
        return new ApiResponse(true, data, message, code);
    }

    static error<T = null>(code: number, message: string, data: T | null = null): ApiResponse<T> {
        return new ApiResponse(false, data, message, code);
    }

    toJSON(): IApiResponse<T> {
        return {
            success: this.success,
            data: this.data,
            message: this.message,
            code: this.code
        };
    }
}
