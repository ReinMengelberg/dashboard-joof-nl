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
  triggerLabel?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
  action: (values: any) => Promise<any>;
  afterSuccess?: () => Promise<any>;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  triggerLabel: 'Delete',
  title: 'Delete Confirmation',
  description: 'Please enter your password to confirm this action',
  action: async () => {console.log('No action provided');return Promise.resolve(false);},
  actionLabel: 'Delete',
  cancelLabel: 'Cancel',
});

const isOpen = ref(false);
const isLoading = ref(false);
const password = ref('');
const error = ref('');

const handleAction = async () => {
  if (!password.value) {
    error.value = 'Password is required';
    return;
  }
  isLoading.value = true;
  error.value = '';
  const success = await props.action(password.value);
  if (success) {
    isOpen.value = false;
    password.value = ''; // Reset password only on success
    if (props.afterSuccess) await props.afterSuccess();
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
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogDescription>
            {{ description }}
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4">
          <div class="items-center gap-4">
            <Label for="password" class="text-right">
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
            {{ isLoading ? 'Deleting...' : actionLabel }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>

</style>