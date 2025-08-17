import { createError } from 'h3'

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

    /**
     * Throws an h3 error with the response data
     * Use this when you want to immediately terminate the request with an error
     */
    static throwError(code: number, message: string, data: any = null): never {
        throw createError({
            statusCode: code,
            statusMessage: message,
            data: {
                success: false,
                data,
                message,
                code
            }
        })
    }

    /**
     * Converts this ApiResponse to an h3 error and throws it
     * Only works if this is an error response
     */
    throwIfError(): this {
        if (!this.success) {
            throw createError({
                statusCode: this.code,
                statusMessage: this.message || 'An error occurred',
                data: this.toJSON()
            })
        }
        return this;
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