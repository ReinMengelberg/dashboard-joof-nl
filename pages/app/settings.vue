<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from '#imports'
import { useAuthStore } from '~/stores/AuthStore'
import { useUserStore } from '~/stores/UserStore'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NotificationService from '~/services/utils/NotificationService'
import ErrorService from '~/services/utils/ErrorService'

definePageMeta({
  layout: 'home',
  middleware: 'authenticated',
})

const auth = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

// Ensure the active user in UserStore is set to the authenticated user
watch(
  () => auth.currentUser?.id,
  (id) => {
    if (id) {
      userStore.view(id)
    } else {
      userStore.active = null
    }
  },
  { immediate: true }
)

// Local UI state for dialogs
const showNameDialog = ref(false)
const showEmailDialog = ref(false)
const showPasswordDialog = ref(false)

// Forms
const newName = ref('')
const nameUpdating = ref(false)
const newEmail = ref('')
const emailUpdating = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordUpdating = ref(false)

const currentEmail = computed(() => userStore.active?.email || '')
const currentName = computed(() => userStore.active?.name || '')

function goBack() {
  if (process.client && window.history.length > 1) router.back()
  else router.push('/app/home')
}

function openNameDialog() {
  newName.value = currentName.value
  showNameDialog.value = true
}
function closeNameDialog() {
  showNameDialog.value = false
}
async function submitNameChange() {
  try {
    nameUpdating.value = true
    const id = auth.currentUser?.id
    if (!id) {
      return ErrorService.returnFalse('error', 'No active user')
    }
    if (!newName.value || newName.value === currentName.value) {
      return ErrorService.returnFalse('warning', 'Please enter a different name')
    }
    const ok = await userStore.update(id, { name: newName.value })
    if (ok) {
      await auth.fetchUser()
      NotificationService.showSuccess('Updated name')
      showNameDialog.value = false
      return true
    }
    return false
  } catch (e: any) {
    return ErrorService.returnFalse(e, e?.message || 'Failed to update name')
  } finally {
    nameUpdating.value = false
  }
}

function openEmailDialog() {
  newEmail.value = currentEmail.value
  showEmailDialog.value = true
}
function closeEmailDialog() {
  showEmailDialog.value = false
}

async function submitEmailChange() {
  try {
    emailUpdating.value = true
    const id = auth.currentUser?.id
    if (!id) {
      return ErrorService.returnFalse('error', 'No active user')
    }
    if (!newEmail.value || newEmail.value === currentEmail.value) {
      return ErrorService.returnFalse('warning', 'Please enter a different email')
    }
    const ok = await userStore.update(id, { email: newEmail.value })
    if (ok) {
      showEmailDialog.value = false
      return true
    }
    return false
  } catch (e: any) {
    return ErrorService.returnFalse(e, e?.message || 'Failed to update email')
  } finally {
    emailUpdating.value = false
  }
}

function openPasswordDialog() {
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  showPasswordDialog.value = true
}
function closePasswordDialog() {
  showPasswordDialog.value = false
}

async function submitPasswordChange() {
  try {
    passwordUpdating.value = true
    const id = auth.currentUser?.id
    if (!id) {
      return ErrorService.returnFalse('error', 'No active user')
    }
    if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
      return ErrorService.returnFalse('warning', 'Please fill in all password fields')
    }
    if (newPassword.value !== confirmPassword.value) {
      return ErrorService.returnFalse('warning', 'New password and confirmation do not match')
    }
    const ok = await userStore.update(id, {
      old_password: oldPassword.value,
      new_password: newPassword.value,
      confirm_password: confirmPassword.value,
    })
    if (ok) {
      NotificationService.showSuccess('Password updated')
      showPasswordDialog.value = false
      return true
    }
    return false
  } catch (e: any) {
    return ErrorService.returnFalse(e, e?.message || 'Failed to update password')
  } finally {
    passwordUpdating.value = false
  }
}
</script>

<template>
  <div class="p-4">
    <Card class="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="icon" class="-ml-2" @click="goBack" aria-label="Go back">
            <i class="ri-arrow-left-line" aria-hidden="true" />
          </Button>
          <CardTitle>User settings</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div class="grid gap-6">
          <!-- Row 1: Name -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div class="grid gap-2 sm:col-span-2">
              <label class="text-sm font-medium text-foreground">Name</label>
              <Input 
                  :model-value="userStore.active?.name || ''" 
                  disabled 
              />
            </div>
            <div class="flex sm:justify-end sm:col-span-1">
              <Button class="w-full" size="sm" @click="openNameDialog">
                <i class="ri-user-line" aria-hidden="true" />
                Change name
              </Button>
            </div>
          </div>

          <!-- Row 2: Email -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div class="grid gap-2 sm:col-span-2">
              <label class="text-sm font-medium text-foreground">Email</label>
              <Input :model-value="userStore.active?.email || ''" disabled />
            </div>
            <div class="flex sm:justify-end sm:col-span-1">
              <Button class="w-full" size="sm" @click="openEmailDialog">
                <i class="ri-mail-settings-line" aria-hidden="true" />
                Change email
              </Button>
            </div>
          </div>

          <!-- Row 3: Password -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div class="grid gap-2 sm:col-span-2">
              <label class="text-sm font-medium text-foreground">Password</label>
              <Input :model-value="'aaaaaaaaaaaa'" type="password" disabled />
            </div>
            <div class="flex sm:justify-end sm:col-span-1">
              <Button class="w-full" size="sm" @click="openPasswordDialog">
                <i class="ri-lock-password-line" aria-hidden="true" />
                Change password
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter class="justify-between border-t">
        <div class="text-xs text-muted-foreground">Fields are read-only. Use the actions to update your account.</div>
      </CardFooter>
    </Card>

    <!-- Name Dialog -->
    <div v-if="showNameDialog" class="fixed inset-0 z-50 grid place-items-center">
      <div class="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      <div class="relative z-10 w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-lg">
        <div class="px-6 py-4 border-b">
          <h3 class="font-semibold">Update name</h3>
        </div>
        <div class="p-6 grid gap-4">
          <p class="text-sm text-muted-foreground">Enter your new display name.</p>
          <div class="grid gap-2">
            <label class="text-sm font-medium">New name</label>
            <Input v-model="newName" type="text" placeholder="Jane Doe" />
          </div>
        </div>
        <div class="px-6 py-4 border-t flex justify-end gap-3">
          <Button variant="outline" @click="closeNameDialog">Cancel</Button>
          <Button :disabled="nameUpdating || !newName" @click="submitNameChange">
            <i class="ri-user-follow-line" aria-hidden="true" />
            {{ nameUpdating ? 'Saving…' : 'Update name' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Email Dialog -->
    <div v-if="showEmailDialog" class="fixed inset-0 z-50 grid place-items-center">
      <div class="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      <div class="relative z-10 w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-lg">
        <div class="px-6 py-4 border-b">
          <h3 class="font-semibold">Update email</h3>
        </div>
        <div class="p-6 grid gap-4">
          <p class="text-sm text-muted-foreground">Enter your new email address. You may need to re-verify it.</p>
          <div class="grid gap-2">
            <label class="text-sm font-medium">New email</label>
            <Input v-model="newEmail" type="email" placeholder="you@example.com" />
          </div>
        </div>
        <div class="px-6 py-4 border-t flex justify-end gap-3">
          <Button variant="outline" @click="closeEmailDialog">Cancel</Button>
          <Button :disabled="emailUpdating || !newEmail" @click="submitEmailChange">
            <i class="ri-mail-send-line" aria-hidden="true" />
            {{ emailUpdating ? 'Saving…' : 'Update email' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Password Dialog -->
    <div v-if="showPasswordDialog" class="fixed inset-0 z-50 grid place-items-center">
      <div class="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      <div class="relative z-10 w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-lg">
        <div class="px-6 py-4 border-b">
          <h3 class="font-semibold">Change password</h3>
        </div>
        <div class="p-6 grid gap-4">
          <div class="grid gap-2">
            <label class="text-sm font-medium">Current password</label>
            <Input v-model="oldPassword" type="password" placeholder="Current password" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium">New password</label>
            <Input v-model="newPassword" type="password" placeholder="New password" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium">Confirm new password</label>
            <Input v-model="confirmPassword" type="password" placeholder="Confirm new password" />
          </div>
        </div>
        <div class="px-6 py-4 border-t flex justify-end gap-3">
          <Button variant="outline" @click="closePasswordDialog">Cancel</Button>
          <Button :disabled="passwordUpdating || !oldPassword || !newPassword || !confirmPassword" @click="submitPasswordChange">
            <i class="ri-lock-password-line" aria-hidden="true" />
            {{ passwordUpdating ? 'Saving…' : 'Update password' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>