<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { ref } from 'vue';

interface Props {
  triggerLabel?: string;
  title?: string;
  description?: string
  actionLabel?: string;
  cancelLabel?: string;
	iconView?: boolean;
  action: () => Promise<any>;
  afterSuccess?: () => Promise<any>;
	size?: 'sm' | 'md' | 'default';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  triggerLabel: 'Delete',
  title: 'Delete Dialog',
  description: 'Press delete to delete',
  action: async () => {console.log('No Action provided');return Promise.resolve(false);},
  actionLabel: 'Delete',
  cancelLabel: 'Cancel',
	iconView: false,
	size: 'default',
  disabled: false
});

const isOpen = ref(false);
const isLoading = ref(false);

const handleAction = async (event: Event) => {
  event.preventDefault();
  isLoading.value = true;
  const success = await props.action();
  if (success) {
    isOpen.value = false;
    if (props.afterSuccess) await props.afterSuccess();
  }
  isLoading.value = false;
};

const openDialog = (event: Event) => {
  event.preventDefault();
  isOpen.value = true;
};

</script>

<template>
  <AlertDialog v-model:open="isOpen">
    <AlertDialogTrigger asChild>
			<Button
				v-if="iconView"
        variant="ghost"
        size="icon"
        class="h-8 w-8 hover:bg-red-100 hover:text-red-600"
        title="Remove file"
      >
        <i class="ri-delete-bin-line text-lg"></i>
      </Button>
      <Button v-else @click="openDialog" class="border bg-white border-red-600 text-red-600 hover:bg-red-600 hover:text-white" :size="size" :disabled="props.disabled">
        {{ triggerLabel }}
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="isOpen = false">{{ cancelLabel }}</AlertDialogCancel>
        <AlertDialogAction
            class="bg-red-600 text-white hover:bg-red-700"
            @click="handleAction"
            :disabled="isLoading"
        >
            <span
                v-if="isLoading"
                class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
          {{ isLoading ? 'Deleting...' : actionLabel }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped>

</style>