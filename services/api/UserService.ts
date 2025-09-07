// UserService connects to the user management API endpoints.
import ApiService from "./ApiService";
import type {IApiResponse} from "@/server/utils/ApiResponse";
import type {User} from "@/src/types/models/user";

export interface ListUsersParams {
    skip?: number;
    take?: number;
    q?: string;
}

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
    public list(params: ListUsersParams = {}): Promise<IApiResponse<User[]>> {
        const query = new URLSearchParams();
        if (typeof params.skip === "number") query.set("skip", String(params.skip));
        if (typeof params.take === "number") query.set("take", String(params.take));
        if (params.q) query.set("q", params.q);
        const qs = query.toString();
        const url = "/list" + (qs ? `?${qs}` : "");
        return this.get(url);
    }

    public mine

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
