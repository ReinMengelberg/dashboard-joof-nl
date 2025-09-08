<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

interface Props {
  rows?: number;
	cols?: number;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
	cols: 3,
	size: 'md',
});
</script>

<template>
    <TableRow v-for="i in props.rows" :key="i">
			<TableCell>
			<div class="flex items-center gap-x-3">
				<Skeleton class="h-16 w-16 rounded-full" :class="props.size === 'sm' ? 'h-9 w-9' : props.size === 'lg' ? 'h-20 w-20' : ''" />
					<div class="min-w-0 flex flex-col items-start justify-center py-2 gap-y-2">
						<Skeleton v-if="props.size !== 'sm'" class="h-3 w-[200px]" />
						<Skeleton class="h-3 w-[150px]" />
						<Skeleton v-if="props.size !== 'sm'" class="h-3 w-[150px]" />
					</div>
				</div>
			</TableCell>
			<TableCell v-for="j in props.cols - 1" :key="j" class="pr-12">
				<Skeleton class="h-3 w-full px-6" />
			</TableCell>
		</TableRow>
</template>