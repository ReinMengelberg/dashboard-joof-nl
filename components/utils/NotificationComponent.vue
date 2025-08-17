<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import NotificationService, { type NotificationEvent } from '~/services/utils/NotificationService';

// An array to hold multiple notifications
const notifications = ref<NotificationEvent[]>([]);

// This handler pushes a new notification into the array
const handleNotification = (payload: NotificationEvent) => {
  console.log("Notification received: ", payload.message)
  notifications.value.push(payload);

  // Automatically remove the notification after the specified duration
  setTimeout(() => {
    const index = notifications.value.indexOf(payload);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }, payload.duration || 5000);
};

// Optional: A method to manually remove a notification (e.g., when clicking the close button)
const removeNotification = (index: number) => {
  notifications.value.splice(index, 1);
};

onMounted(() => {
  NotificationService.onNotify(handleNotification);
});

onUnmounted(() => {
  NotificationService.offNotify(handleNotification);
});
</script>

<template>
  <!-- Global notification live region -->
  <div aria-live="assertive" class="pointer-events-none fixed inset-0 z-[100]">
    <!-- Main wrapper with padding and right alignment -->
    <div class="float-right w-full max-w-lg px-4 py-2">
      <!-- Stack container -->
      <div class="space-y-4">
        <transition-group
            name="notification"
            tag="div"
            enter-active-class="transform ease-out duration-300 transition"
            enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
          <div
              v-for="(notification, index) in notifications"
              :key="index"
              class="mt-2 pointer-events-auto w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5"
          >
            <!-- Success Notification-->
            <div v-if="notification.type === 'success'" class="p-4">
              <div class="flex items-start">
                <div class="shrink-0">
                  <i class="ri-checkbox-circle-line ri-xl text-green-500" aria-hidden="true" />
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p class="text-sm font-medium text-gray-900">
                    Success
                  </p>
                  <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
                </div>
                <div class="ml-4 flex shrink-0">
                  <button
                      type="button"
                      @click="removeNotification(index)"
                      class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span class="sr-only">Close</span>
                    <i class="ri-close-line ri-lg" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Info Notification-->
            <div v-if="notification.type === 'info'" class="p-4">
              <div class="flex items-start">
                <div class="shrink-0">
                  <i class="ri-information-line ri-xl text-gray-500" aria-hidden="true" />
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p class="text-sm font-medium text-gray-900">
                    Info
                  </p>
                  <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
                </div>
                <div class="ml-4 flex shrink-0">
                  <button
                      type="button"
                      @click="removeNotification(index)"
                      class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span class="sr-only">Close</span>
                    <i class="ri-close-line ri-lg" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Warning Notification-->
            <div v-if="notification.type === 'warning'" class="p-4">
              <div class="flex items-start">
                <div class="shrink-0">
                  <i class="ri-error-warning-line ri-xl text-orange-500" aria-hidden="true" />
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p class="text-sm font-medium text-gray-900">
                    Warning
                  </p>
                  <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
                </div>
                <div class="ml-4 flex shrink-0">
                  <button
                      type="button"
                      @click="removeNotification(index)"
                      class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span class="sr-only">Close</span>
                    <i class="ri-close-line ri-lg" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Error Notification-->
            <div v-if="notification.type === 'error'" class="p-4">
              <div class="flex items-start">
                <div class="shrink-0">
                  <i class="ri-close-circle-line ri-xl text-red-500" aria-hidden="true" />
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p class="text-sm font-medium text-gray-900">
                    Error
                  </p>
                  <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
                </div>
                <div class="ml-4 flex shrink-0">
                  <button
                      type="button"
                      @click="removeNotification(index)"
                      class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span class="sr-only">Close</span>
                    <i class="ri-close-line ri-lg" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Email Notification-->
            <div v-if="notification.type === 'email'" class="p-4">
              <div class="flex items-start">
                <div class="shrink-0">
                  <i class="ri-mail-unread-line ri-2x" aria-hidden="true" />
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p class="text-sm font-medium text-gray-900">
                    New email from {{ notification.sender }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
                </div>
                <div class="pr-10 pt-2">
                  <Button href="" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Open
                  </Button>
                </div>
                <div class="ml-4 flex shrink-0">
                  <button
                      type="button"
                      @click="removeNotification(index)"
                      class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span class="sr-only">Close</span>
                    <i class="ri-close-line ri-lg" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Chat Notification-->
            <div v-if="notification.type === 'chat'" class="p-4">
              <div class="flex items-start">
                <div class="shrink-0">
                  <i class="ri-chat-unread-line ri-2x" aria-hidden="true" />
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p class="text-sm font-medium text-gray-900">
                    New message from {{ notification.sender }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
                </div>
                <div class="pr-10 pt-2">
                  <Button href="" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Reply
                  </Button>
                </div>
                <div class="ml-4 flex shrink-0">
                  <button
                      type="button"
                      @click="removeNotification(index)"
                      class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span class="sr-only">Close</span>
                    <i class="ri-close-line ri-lg" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* You can add styles for the transition group if needed */
</style>