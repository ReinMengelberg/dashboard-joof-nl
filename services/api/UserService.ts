// UserService connects to the user management API endpoints.
import ApiService from "./ApiService";
import type { IApiResponse } from "@/server/utils/ApiResponse";
import type { User } from "@/src/types/models/user";

export interface ListUsersParams {
  skip?: number;
  take?: number;
  q?: string;
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
  password?: string;
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

  // Get a single user by ID
  public getById(userId: number): Promise<IApiResponse<User>> {
    return this.get(`/${userId}`);
  }

  // Create a new user
  public create(request: CreateUserRequest): Promise<IApiResponse<User>> {
    return this.post("/create", request);
  }

  // Update a user by ID (partial)
  public update(userId: number, request: UpdateUserRequest): Promise<IApiResponse<User>> {
    return this.patch(`/${userId}`, request);
  }

  // Delete a user by ID
  public delete(userId: number): Promise<IApiResponse<null>> {
    // ApiService.delete has a data param; pass undefined
    return this.deleteFn<null>(`/${userId}`);
  }

  // Helper to call base delete without name clash
  private deleteFn<T>(endpoint: string, data?: any): Promise<IApiResponse<T>> {
    return super.delete<T>(endpoint, data);
  }
}
