// ResourceService connects to the resource management API endpoints.
import ApiService from "./ApiService";
import type { IApiResponse } from "@/server/utils/ApiResponse";
import type { Resource } from "@/src/types/models/resource";

export interface ListResourcesParams {
  skip?: number;
  take?: number;
  q?: string;
}

export interface CreateResourceRequest {
  // Server create endpoint currently only accepts name
  name: string;
}

export interface UpdateResourceRequest {
  // Server patch endpoint currently supports updating name only
  name?: string;
}

export default class ResourceService extends ApiService {
  protected override namespace = "/api/resource";

  constructor() {
    super();
  }

  // List resources with optional pagination and query
  public list(params: ListResourcesParams = {}): Promise<IApiResponse<Resource[]>> {
    const query = new URLSearchParams();
    if (typeof params.skip === "number") query.set("skip", String(params.skip));
    if (typeof params.take === "number") query.set("take", String(params.take));
    if (params.q) query.set("q", params.q);
    const qs = query.toString();
    const url = "/list" + (qs ? `?${qs}` : "");
    return this.get(url);
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
    return this.patch(`/${resourceId}`, request);
  }

  // Delete a resource by ID
  public destroy(resourceId: number, payload?: { password?: string }): Promise<IApiResponse<null>> {
    return this.delete(`/${resourceId}`, payload);
  }

  // Assign a user to a resource
  public assignUser(resourceId: number, userId: number): Promise<IApiResponse<Resource | null>> {
    return this.post(`/${resourceId}/assign`, { user_id: userId });
  }

  // Unassign a user from a resource
  public unassignUser(resourceId: number, userId: number): Promise<IApiResponse<Resource | null>> {
    return this.delete(`/${resourceId}/assign}`, { user_id: userId });
  }
}
