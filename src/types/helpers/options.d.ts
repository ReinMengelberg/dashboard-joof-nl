import {string} from "zod";

export interface OptionItem {
    value: string | number | null;
    label: string;
    description?: string | null;
    icon?: string | null;
    color?: string | null;
    count?: number | null;
    avatar?: string | null;
}

export interface OptionGroup {
    list: OptionItem[];
    default?: string | number | null;
}
