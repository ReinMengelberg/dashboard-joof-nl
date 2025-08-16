import type { FetchOptions } from 'ofetch';
import { $fetch } from 'ofetch';
import { useRuntimeConfig } from 'nuxt/app';
import type { IApiResponse } from '../../src/helpers/ApiResponse';

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

    public async get<T>(
        endpoint: string,
        config: FetchOptions = {}
    ): Promise<IApiResponse<T>> {
        try {
            return await this.client<IApiResponse<T>>(this.buildUrl(endpoint), {
                method: 'GET',
                ...config,
            });
        } catch (error: any) {
            throw this.normalizeError(error);
        }
    }

    public async post<T>(
        endpoint: string,
        data?: any,
        config: FetchOptions = {}
    ): Promise<IApiResponse<T>> {
        try {
            return await this.client<IApiResponse<T>>(this.buildUrl(endpoint), {
                method: 'POST',
                body: data,
                ...this.withJsonHeaderIfNeeded(data, config),
            });
        } catch (error: any) {
            throw this.normalizeError(error);
        }
    }

    public async patch<T>(
        endpoint: string,
        data?: any,
        config: FetchOptions = {}
    ): Promise<IApiResponse<T>> {
        try {
            return await this.client<IApiResponse<T>>(this.buildUrl(endpoint), {
                method: 'PATCH',
                body: data,
                ...this.withJsonHeaderIfNeeded(data, config),
            });
        } catch (error: any) {
            throw this.normalizeError(error);
        }
    }

    public async put<T>(
        endpoint: string,
        data?: any,
        config: FetchOptions = {}
    ): Promise<IApiResponse<T>> {
        try {
            return await this.client<IApiResponse<T>>(this.buildUrl(endpoint), {
                method: 'PUT',
                body: data,
                ...this.withJsonHeaderIfNeeded(data, config),
            });
        } catch (error: any) {
            throw this.normalizeError(error);
        }
    }

    public async delete<T>(
        endpoint: string,
        data?: any,
        config: FetchOptions = {}
    ): Promise<IApiResponse<T>> {
        try {
            return await this.client<IApiResponse<T>>(this.buildUrl(endpoint), {
                method: 'DELETE',
                // Some APIs accept a body for DELETE; pass only if provided
                ...(data !== undefined ? { body: data } : {}),
                ...this.withJsonHeaderIfNeeded(data, config),
            });
        } catch (error: any) {
            throw this.normalizeError(error);
        }
    }

    // Helpers

    protected withJsonHeaderIfNeeded(
        body: any,
        config: FetchOptions
    ): FetchOptions {
        // If sending plain objects/arrays, default to JSON
        const isFormData =
            typeof FormData !== 'undefined' && body instanceof FormData;
        if (!isFormData) {
            return {
                headers: {
                    'Content-Type': 'application/json',
                    ...(config.headers as Record<string, string> | undefined),
                },
                ...config,
            };
        }
        return config;
    }

    protected normalizeError(error: any) {
        // ofetch throws FetchError with status and data
        const status = error?.response?.status ?? error?.status ?? 500;
        const message =
            error?.response?._data?.message ??
            error?.data?.message ??
            error?.message ??
            'An error occurred';

        return {
            success: false,
            data: null,
            message,
            code: status,
        } as IApiResponse<null>;
    }
}
