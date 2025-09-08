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
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
  action: () => Promise<any>;
  afterSuccess?: () => Promise<any>;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  triggerLabel: 'Confirm',
  title: 'Confirmation Dialog',
  description: 'Press continue to confirm',
  action: async () => {console.log('No Action provided');return Promise.resolve(false);},
  actionLabel: 'Continue',
  cancelLabel: 'Cancel',
  disabled: false
});

const isOpen = ref(false);
const isLoading = ref(false);

const handleAction = async () => {
  isLoading.value = true;
  const success = await props.action()
  if (success) {
    isOpen.value = false;
    if (props.afterSuccess) await props.afterSuccess();
  }
  isLoading.value = false;
};

const openDialog = () => {
  isOpen.value = true;
};
</script>

<template>
  <AlertDialog v-model:open="isOpen">
    <AlertDialogTrigger asChild>
      <slot name="trigger" :open-dialog="openDialog">
        <Button
            @click="openDialog"
            :disabled="props.disabled"
            class="bg-blue-600 text-white hover:bg-blue-700">
          {{ triggerLabel }}
        </Button>
      </slot>
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
            class="bg-blue-600 text-white hover:bg-blue-700"
            @click="handleAction"
            :disabled="isLoading"
        >
          <span
            v-if="isLoading"
            class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
        />
          {{ isLoading ? 'Loading...' : actionLabel }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped>

</style>