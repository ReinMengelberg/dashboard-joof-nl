// ResourceService connects to the resource management API endpoints.
import ApiService from "./ApiService";
import type {IApiResponse} from "@/server/utils/ApiResponse";
import type {Resource} from "@/src/types/models/resource";
import type {PaginatedData} from "@/src/types/api/PaginatedData";
import type {User} from "@/src/types/models/user";
import type {UserFilters} from "@/services/api/UserService";


export interface ResourceFilters {
    source: 'joof' | 'angryjobs'
}

export interface CreateResourceRequest {
    name: string;
    description?: string;
    source: 'joof' | 'angryjobs'
    administrative?: boolean;
    outgoing_feeds?: string[];
    incoming_feeds?: string[];
    show_incoming?: boolean;
    only_nl?: boolean;
    only_unique?: boolean;
}

export interface UpdateResourceRequest {
    name?: string;
    description?: string;
    source?: 'joof' | 'angryjobs';
    outgoing_feeds?: string[];
    incoming_feeds?: string[];
    show_incoming?: boolean;
    only_nl?: boolean;
    only_unique?: boolean;
}

export default class ResourceService extends ApiService {
    protected override namespace = "/api/resource";

    constructor() {
        super();
    }

    // List resources with optional pagination and query
    public list(
        search: string,
        filters: ResourceFilters,
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

    public mine(
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
        return this.get(`/mine${queryString ? `?${queryString}` : ''}`);
    }


    // Create a new resource
    public create(request: CreateResourceRequest): Promise<IApiResponse<Resource>> {
        return this.post("/create", request);
    }

    // Get a single resource by ID
    public view(resourceId: number): Promise<IApiResponse<Resource>> {
        return this.get(`/${resourceId}`);
    }

    // Update a resource by ID (partial)
    public update(resourceId: number, request: UpdateResourceRequest): Promise<IApiResponse<Resource>> {
        // Strip out undefined values to avoid sending them to the API
        const payload = Object.fromEntries(
            Object.entries(request).filter(([, v]) => v !== undefined)
        ) as UpdateResourceRequest;

        return this.patch(`/${resourceId}`, payload);
    }

    // Delete a resource by ID
    public destroy(resourceId: number, payload?: { password?: string }): Promise<IApiResponse<null>> {
        return this.delete(`/${resourceId}`, payload);
    }

    // Assign a user to a resource
    public assignUser(resourceId: number, userId: number): Promise<IApiResponse<Resource | null>> {
        return this.post(`/${resourceId}/assign`, {user_id: userId});
    }

    // Unassign a user from a resource
    public unassignUser(resourceId: number, userId: number): Promise<IApiResponse<Resource | null>> {
        return this.delete(`/${resourceId}/assign}`, {user_id: userId});
    }
}

