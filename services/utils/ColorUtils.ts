export const getTextColor = (color: string | null | undefined, intensity: number | undefined = 600): string => {
    if (!color) return 'text-gray-700';

    const colorMatch = color.match(/bg-(\w+)-\d+/);
    if (colorMatch && colorMatch[1]) {
        const colorName = colorMatch[1];
        return `text-${colorName}-${intensity}`;
    }
    return 'text-gray-700';
};

export const getBorderColor = (color: string | null | undefined, intensity: number | undefined = 600): string => {
    if (!color) return 'border-gray-300';

    const colorMatch = color.match(/bg-(\w+)-\d+/);
    if (colorMatch && colorMatch[1]) {
        const colorName = colorMatch[1];
        return `border-${colorName}-${intensity}`;
    }
    return 'border-gray-300';
};

export const getBgColor = (color: string | null | undefined, intensity: number | undefined = 600): string => {
    if (!color) return 'bg-gray-300';

    const colorMatch = color.match(/bg-(\w+)-\d+/);
    if (colorMatch && colorMatch[1]) {
        const colorName = colorMatch[1];
        return `bg-${colorName}-${intensity}`;
    }
    return 'bg-gray-300';
};

export const getRingColor = (color: string | null | undefined, intensity: number | undefined = 600): string => {
    if (!color) return 'ring-gray-300';

    const colorMatch = color.match(/bg-(\w+)-\d+/);
    if (colorMatch && colorMatch[1]) {
        const colorName = colorMatch[1];
        return `ring-${colorName}-${intensity}`;
    }
    return 'ring-gray-300';
};

export const getRawColor = (color: string | null | undefined): string | null => {
    if (!color) return null;

    const colorMatch = color.match(/bg-(\w+)-\d+/);
    if (colorMatch && colorMatch[1]) {
        return colorMatch[1];
    }
    return null;
};
