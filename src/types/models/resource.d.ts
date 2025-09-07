import {User} from "./user";

export type Resource = {
    id: number;
    name: string;
    description: string;
    source: 'joof' | 'angryjobs';
    administrative: boolean;
    outgoing_feeds: array<string>;
    incoming_feeds: array<string>;
    show_incoming: boolean;
    only_nl: boolean;
    only_unique: boolean;
    created_at: string;
    updated_at: string;

    // Relations:
    users: User[];
}