<script setup lang="ts">
interface Props {
    size?: 'sm' | 'md' | 'lg';
    color?: string | null; // blue, yellow, red etc.
    class?: string;
    inline?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    inline: true,
});

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'text-[10px] px-1.5 py-0.5 gap-1';
        case 'lg':
            return 'text-sm px-3 py-1 gap-1.5';
        default:
            return 'text-xs px-2 py-1 gap-1';
    }
});

const colorClasses = computed(() => {
    if (props.class) {
        return props.class;
    }
    return `bg-${props.color}-50 text-${props.color}-700 ring-${props.color}-600/20`;
});
</script>

<template>
    <span 
        :class="[
            'items-center rounded-full font-medium ring-1 ring-inset whitespace-nowrap',
            sizeClasses,
            colorClasses,
            props.inline ? 'inline-flex' : 'flex w-fit'
        ]"
    >
        <slot></slot>
    </span>
</template>