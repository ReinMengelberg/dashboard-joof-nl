export interface PaginatedData<T> {
    current_page: number;
    data: T;
    last_page: number;
    per_page: number;
    from: number | null;
    to: number | null;
    total: number;
}