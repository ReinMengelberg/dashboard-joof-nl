<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ref } from "vue";

interface Props {
  model: any;
  delete: (id: string, password?: string) => Promise<boolean>;
  afterSuccess?: () => any;
  // Configurable text properties
  title?: string;
  description?: string;
  triggerLabel?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  redirectPath?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Delete Model',
  description: 'Permanently delete this model and all of its related data. This action cannot be undone.',
  triggerLabel: 'Delete Model',
  dialogTitle: 'Delete Model',
  dialogDescription: 'This action cannot be undone. This will permanently delete this model and all of its data.',
  confirmLabel: 'Delete Model',
  cancelLabel: 'Cancel',
  redirectPath: '/global/home',
  disabled: false,
});

const isOpen = ref(false);
const isLoading = ref(false);
const password = ref('');
const error = ref('');

const handleDelete = async (passwordVal?: string): Promise<boolean> => {
  try {
    return await props.delete(props.model?.id, passwordVal);
  } catch (error_) {
    console.error('Delete operation failed:', error_);
    return false;
  }
};

const handleAfterSuccess = () => {
  if (props.afterSuccess) {
    props.afterSuccess();
  } else {
    navigateTo(props.redirectPath);
  }
};

const handleAction = async () => {
  if (!password.value) {
    error.value = 'Password is required';
    return;
  }
  isLoading.value = true;
  error.value = '';
  const success = await handleDelete(password.value || undefined);
  if (success) {
    isOpen.value = false;
    password.value = '';
    if (props.afterSuccess) handleAfterSuccess();
  }
  isLoading.value = false;
};

const openDialog = (event: Event) => {
  event.preventDefault();
  error.value = '';
  password.value = '';
  isOpen.value = true;
};

const closeDialog = () => {
  isOpen.value = false;
  error.value = '';
  password.value = '';
};
</script>

<template>
  <div class="space-y-4 py-2">
    <div class="flex items-center justify-between rounded-lg border p-4">
      <div class="space-y-0.5">
        <h4 class="font-medium">{{ title }}</h4>
        <p class="text-sm text-muted-foreground">
          {{ description }}
        </p>
      </div>

      <div>
        <Button
          @click="openDialog"
          class="border bg-white border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          :disabled="disabled"
        >
          {{ triggerLabel }}
        </Button>

        <Dialog :open="isOpen" @update:open="closeDialog">
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{{ dialogTitle }}</DialogTitle>
              <DialogDescription>
                {{ dialogDescription }}
              </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4">
              <div class="items-center gap-4">
                <Label for="password" class="text-right mb-2">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  v-model="password"
                  placeholder="Enter your password"
                  class="col-span-3"
                  @keyup.enter="handleAction"
                />
              </div>
              <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                @click="closeDialog"
              >
                {{ cancelLabel }}
              </Button>
              <Button
                @click="handleAction"
                class="bg-red-600 text-white hover:bg-red-700"
                :disabled="isLoading"
              >
                <span
                  v-if="isLoading"
                  class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                />
                {{ isLoading ? 'Deleting...' : confirmLabel }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>