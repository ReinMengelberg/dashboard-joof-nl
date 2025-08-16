// Auth connects to the resource API endpoints.]
import ApiService from "./ApiService";
import {IApiResponse} from "../../src/helpers/ApiResponse";

export interface LoginRequest {
    email: string
    password: string
}

export interface SignupRequest {
    name: string
    email: string
    password: string
    password_confirmation: string
    terms?: boolean
}

export default class AuthService extends ApiService {
    // Define namespace
    protected override namespace = '/auth';
    constructor() {
        super()
    }

    public login(request: SignupRequest): Promise<IApiResponse<string|null>> {
        return this.post('/login', request)
    }
}