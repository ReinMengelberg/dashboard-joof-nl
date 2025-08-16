import {Resource} from "./resource";

export type User = {
    id: number;
    name: string;
    email: string;
    admin: boolean;
    password: string;
    password_reset_token: string;
    password_reset_expires_at: string;
    verified_at: string;
    created_at: string;
    updated_at: string;

    // Relations:
    default_resource: Resource;
    resources: Resource[];
}