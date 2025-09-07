import type {OptionItem} from "~/src/types/helpers/options"

export const getOptionLabel = (value: string | number | undefined, options: OptionItem[]): string => {
    const option = options.find(opt => opt.value === value);
    return option?.label || '';
};

export const getOptionColor = (value: string | number | undefined, options: OptionItem[]): string => {
    const option = options.find(opt => opt.value === value);
    return option?.color || '';
};

export const getOptionDescription = (value: string | number | undefined, options: OptionItem[]): string => {
    const option = options.find(opt => opt.value === value);
    return option?.description || '';
};

export const getOptionIcon = (value: string | number | undefined, options: OptionItem[]): string => {
    const option = options.find(opt => opt.value === value);
    return option?.icon || '';
};

export const getOptionAvatar = (value: string | number | undefined, options: OptionItem[]): string => {
    const option = options.find(opt => opt.value === value);
    return option?.avatar || '';
};

export const getOption = (value: string | number | undefined, options: OptionItem[]): OptionItem | undefined => {
    return options.find(opt => opt.value === value);
};

export const getOptionValueFromMorph = (type: string | undefined | null, id: number | string | undefined | null): string | null => {
    if (!type || !id) return null;
    return `${type}:${id}`;
}

// Generic function to get any property
export const getOptionProperty = <K extends keyof OptionItem>(
    value: string | number | undefined,
    options: OptionItem[],
    property: K
): OptionItem[K] | undefined => {
    const option = options.find(opt => opt.value === value);
    return option?.[property];
};
