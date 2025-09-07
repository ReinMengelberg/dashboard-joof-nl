// UserService connects to the user management API endpoints.
import ApiService from "./ApiService";
import type {IApiResponse} from "@/server/utils/ApiResponse";
import type {User} from "@/src/types/models/user";
import type {PaginatedData} from "@/src/types/api/PaginatedData";

export interface UserFilters {
    admin?: boolean;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    admin?: boolean;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    old_password?: string;
    new_password?: string;
    confirm_password?: string;
    admin?: boolean;
}

export default class UserService extends ApiService {
    protected override namespace = "/api/user";

    constructor() {
        super();
    }

    // List users with optional pagination and query
    public list(
        search: string,
        filters: UserFilters,
        page: number,
        per_page: number
    ): Promise<IApiResponse<PaginatedData<User[]>>> {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page.toString());
        if (per_page) params.append("per_page", per_page.toString());
        if (filters && typeof filters === "object") {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }
        const queryString = params.toString();
        return this.get(`/list${queryString ? `?${queryString}` : ''}`);
    }

    // Create a new user
    public create(request: CreateUserRequest): Promise<IApiResponse<User>> {
        return this.post("/create", request);
    }

    // Get a single user by ID
    public view(userId: number): Promise<IApiResponse<User>> {
        return this.get(`/${userId}`);
    }

    // Update a user by ID (partial)
    public update(userId: number, request: UpdateUserRequest): Promise<IApiResponse<User>> {
        return this.patch(`/${userId}`, request);
    }

    // Delete a user by ID (optional password body)
    public destroy(userId: number, payload?: { password?: string }): Promise<IApiResponse<null>> {
        return this.delete(`/${userId}`, payload);
    }
}
