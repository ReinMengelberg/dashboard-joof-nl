import type { FetchOptions, $Fetch } from 'ofetch';
import { $fetch } from 'ofetch';
import { useRuntimeConfig } from 'nuxt/app';
import type { IApiResponse } from '@/src/helpers/ApiResponse';

export default class ApiService {
    // Create a typed $fetch client
    protected client: <T>(url: string, opts?: FetchOptions) => Promise<T>;

    // Default to empty; subclasses can override to prefix endpoints (e.g., '/auth')
    protected namespace = '';

    constructor(baseURL?: string, defaultOptions: FetchOptions = {}) {
        const config = useRuntimeConfig();
        const resolvedBaseURL =
            baseURL ?? (config?.public as any)?.apiBase ?? '';

        this.client = $fetch.create({
            baseURL: resolvedBaseURL,
            responseType: 'json', // lock to JSON to avoid union return types
            credentials: (defaultOptions as FetchOptions<'json'>).credentials ?? 'include',
            headers: defaultOptions.headers,
            onRequest: defaultOptions.onRequest,
            onResponse: defaultOptions.onResponse,
            onRequestError: defaultOptions.onRequestError,
            onResponseError: defaultOptions.onResponseError,
        }) as $Fetch<unknown, 'json'>;
    }

    protected buildUrl(endpoint: string): string {
        // Ensure no accidental double slashes except protocol
        const ns = this.namespace.replace(/\/+$/, '');
        const ep = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return `${ns}${ep}`;
    }

    public async get<T>(endpoint: string, config: any = {}): Promise<ApiResponse<T>> {
        try {
            const response = await this.client(this.buildUrl(endpoint), {
                method: 'GET',
                ...config,
            });
            return response as ApiResponse<T>;
        } catch (error: any) {
            throw {
                success: false,
                data: null,
                message: error?.response?._data?.message || 'An error occurred',
                code: error?.response?.status || 500,
            };
        }
    }

    public async post<T>(endpoint: string, data: any, config: any = {}): Promise<ApiResponse<T>> {
        try {
            const response = await this.client(this.buildUrl(endpoint), {
                method: 'POST',
                body: data,
                ...config,
            });
            console.log(response)
            return response as ApiResponse<T>;
        } catch (error: any) {
            console.log(error)
            throw {
                success: false,
                data: null,
                message: error?.response?._data?.message || 'An error occurred',
                code: error?.response?.status || 500,
            };
        }
    }

    public async patch<T>(endpoint: string, data: any, config: any = {}): Promise<ApiResponse<T>> {
        try {
            const response = await this.client(this.buildUrl(endpoint), {
                method: 'PATCH',
                body: data,
                ...config,
            });
            return response as ApiResponse<T>;
        } catch (error: any) {
            throw {
                success: false,
                data: null,
                message: error?.response?._data?.message || 'An error occurred',
                code: error?.response?.status || 500,
            };
        }
    }

    public async put<T>(endpoint: string, data: any, config: any = {}): Promise<ApiResponse<T>> {
        try {
            const response = await this.client(this.buildUrl(endpoint), {
                method: 'PUT',
                body: data,
                ...config,
            });
            return response as ApiResponse<T>;
        } catch (error: any) {
            throw {
                success: false,
                data: null,
                message: error?.response?._data?.message || 'An error occurred',
                code: error?.response?.status || 500,
            };
        }
    }

    public async delete<T>(endpoint: string, data: any, config: any = {}): Promise<ApiResponse<T>> {
        try {
            const response = await this.client(this.buildUrl(endpoint), {
                method: 'DELETE',
                body: data,
                ...config,
            });
            return response as ApiResponse<T>;
        } catch (error: any) {
            throw {
                success: false,
                data: null,
                message: error?.response?._data?.message || 'An error occurred',
                code: error?.response?.status || 500,
            };
        }
    }
}