<script setup lang="ts">
import {ref, computed, watch, reactive} from 'vue'
import {useRouter} from '#imports'
import {useAuthStore} from '~/stores/AuthStore'
import {useUserStore} from '~/stores/UserStore'
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from '@/components/ui/dialog'
import NotificationService from '~/services/utils/NotificationService'
import ErrorService from '~/services/utils/ErrorService'
import DeleteInterface from "@/components/utils/DeleteInterface.vue";

definePageMeta({
  layout: 'home',
  middleware: 'authenticated',
})

const auth = useAuthStore()
const userStore = useUserStore()

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
    {immediate: true}
)

// Local UI state for dialogs
const showNameDialog = ref(false)
const showEmailDialog = ref(false)
const showPasswordDialog = ref(false)

// Separate form states and updating flags per form
const nameUpdating = ref(false)
const nameForm = reactive({
  value: '',
})

function toggleNameDialog(force?: boolean) {
  const next = typeof force === 'boolean' ? force : !showNameDialog.value
  if (next && !showNameDialog.value) {
    // opening: initialize form
    nameForm.value = userStore.active?.name
  }
  showNameDialog.value = next
}

async function submitNameChange() {
  nameUpdating.value = true
  const id = auth.currentUser?.id
  if (!id) {
    return ErrorService.returnFalse('error', 'No active user')
  }
  if (!nameForm.value || nameForm.value === userStore.active?.name) {
    return ErrorService.returnFalse('warning', 'Please enter a different name')
  }
  const ok = await userStore.update(id, {name: nameForm.value})
  if (ok) {
    await auth.fetchUser()
    toggleNameDialog(false)
    nameUpdating.value = false
    return true
  }
  nameUpdating.value = false
  return false
}

const emailUpdating = ref(false)
const emailForm = reactive({
  value: '',
})

function toggleEmailDialog(force?: boolean) {
  const next = typeof force === 'boolean' ? force : !showEmailDialog.value
  if (next && !showEmailDialog.value) {
    // opening: initialize form
    emailForm.value = userStore.active?.email
  }
  showEmailDialog.value = next
}

async function submitEmailChange() {
  emailUpdating.value = true
  const id = auth.currentUser?.id
  if (!id) {
    return ErrorService.returnFalse('error', 'No active user')
  }
  if (!emailForm.value || emailForm.value === userStore.active?.email) {
    return ErrorService.returnFalse('warning', 'Please enter a different email')
  }
  const ok = await userStore.update(id, {email: emailForm.value})
  if (ok) {
    await auth.fetchUser()
    toggleEmailDialog(false)
    emailUpdating.value = false
    return true
  }
  emailUpdating.value = false
  return false
}

const passwordUpdating = ref(false)
const passwordForm = reactive({
  old: '',
  new: '',
  confirm: '',
})

// Delete account adapter for DeleteInterface
const deleteAccount = async (id: string, password?: string): Promise<boolean> => {
  const numId = Number(id)
  if (!numId || isNaN(numId)) {
    return ErrorService.returnFalse('error', 'Invalid user id')
  }
  if (!password) {
    return ErrorService.returnFalse('warning', 'Password is required')
  }
  return await userStore.destroy(numId, password)
}

const afterDeleteSuccess = async () => {
  // If the current user deleted themselves, send them to login
  await navigateTo('/auth/login')
}

function togglePasswordDialog(force?: boolean) {
  const next = typeof force === 'boolean' ? force : !showPasswordDialog.value
  if (next && !showPasswordDialog.value) {
    // opening: initialize form
    passwordForm.old = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
  }
  showPasswordDialog.value = next
}

async function submitPasswordChange() {
  passwordUpdating.value = true
  const id = auth.currentUser?.id
  if (!id) {
    return ErrorService.returnFalse('error', 'No active user')
  }
  if (!passwordForm.old || !passwordForm.new || !passwordForm.confirm) {
    return ErrorService.returnFalse('warning', 'Please fill in all password fields')
  }
  const ok = await userStore.update(id, {
    old_password: passwordForm.old,
    new_password: passwordForm.new,
    confirm_password: passwordForm.confirm,
  })
  if (ok) {
    NotificationService.showSuccess('Password updated')
    togglePasswordDialog(false)
    passwordUpdating.value = false
    return true
  }
  passwordUpdating.value = false
  return false
}
</script>

<template>
  <div class="p-4">
    <Card class="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="icon" class="-ml-2" @click="navigateTo('/app/home')" aria-label="Go back">
            <i class="ri-arrow-left-line" aria-hidden="true"/>
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
              <Button class="w-full" size="sm" @click="toggleNameDialog(true)">
                <i class="ri-user-line" aria-hidden="true"/>
                Change name
              </Button>
            </div>
          </div>

          <!-- Row 2: Email -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div class="grid gap-2 sm:col-span-2">
              <label class="text-sm font-medium text-foreground">Email</label>
              <Input :model-value="userStore.active?.email || ''" disabled/>
            </div>
            <div class="flex sm:justify-end sm:col-span-1">
              <Button class="w-full" size="sm" @click="toggleEmailDialog(true)">
                <i class="ri-mail-settings-line" aria-hidden="true"/>
                Change email
              </Button>
            </div>
          </div>

          <!-- Row 3: Password -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div class="grid gap-2 sm:col-span-2">
              <label class="text-sm font-medium text-foreground">Password</label>
              <Input :model-value="'aaaaaaaaaaaa'" type="password" disabled/>
            </div>
            <div class="flex sm:justify-end sm:col-span-1">
              <Button class="w-full" size="sm" @click="togglePasswordDialog(true)">
                <i class="ri-lock-password-line" aria-hidden="true"/>
                Change password
              </Button>
            </div>
          </div>
          
          <DeleteInterface
            :model="userStore.active"
            :delete="deleteAccount"
            :after-success="afterDeleteSuccess"
            title="Delete account"
            description="Permanently delete your account and all associated data. This action cannot be undone."
            trigger-label="Delete account"
            dialog-title="Confirm account deletion"
            dialog-description="This action cannot be undone. Please enter your password to confirm."
            confirm-label="Delete account"
            cancel-label="Cancel"
            redirect-path="/auth/login"
            :disabled="!userStore.active?.id"
          />
        </div>
      </CardContent>

      <CardFooter class="justify-between items-center gap-4 border-t">
        <div class="text-xs text-muted-foreground">Fields are read-only. Use the actions to update your account.</div>
      </CardFooter>
    </Card>

    <!-- Name Dialog (shadcn) -->
    <Dialog :open="showNameDialog" @update:open="toggleNameDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update name</DialogTitle>
          <DialogDescription>Enter your new display name.</DialogDescription>
        </DialogHeader>
        <div class="grid gap-2">
          <label class="text-sm font-medium">New name</label>
          <Input v-model="nameForm.value" type="text" placeholder="Jane Doe" />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="toggleNameDialog(false)">Cancel</Button>
          <Button :disabled="nameUpdating || !nameForm.value" @click="submitNameChange">
            <i class="ri-user-follow-line" aria-hidden="true" />
            {{ nameUpdating ? 'Saving…' : 'Update name' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Email Dialog (shadcn) -->
    <Dialog :open="showEmailDialog" @update:open="toggleEmailDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update email</DialogTitle>
          <DialogDescription>Enter your new email address. You may need to re-verify it.</DialogDescription>
        </DialogHeader>
        <div class="grid gap-2">
          <label class="text-sm font-medium">New email</label>
          <Input v-model="emailForm.value" type="email" placeholder="you@example.com" />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="toggleEmailDialog(false)">Cancel</Button>
          <Button :disabled="emailUpdating || !emailForm.value" @click="submitEmailChange">
            <i class="ri-mail-send-line" aria-hidden="true" />
            {{ emailUpdating ? 'Saving…' : 'Update email' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Password Dialog (shadcn) -->
    <Dialog :open="showPasswordDialog" @update:open="togglePasswordDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>Update your account password.</DialogDescription>
        </DialogHeader>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <label class="text-sm font-medium">Current password</label>
            <Input v-model="passwordForm.old" type="password" placeholder="Current password" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium">New password</label>
            <Input v-model="passwordForm.new" type="password" placeholder="New password" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium">Confirm new password</label>
            <Input v-model="passwordForm.confirm" type="password" placeholder="Confirm new password" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="togglePasswordDialog(false)">Cancel</Button>
          <Button :disabled="passwordUpdating || !passwordForm.old || !passwordForm.new || !passwordForm.confirm" @click="submitPasswordChange">
            <i class="ri-lock-password-line" aria-hidden="true" />
            {{ passwordUpdating ? 'Saving…' : 'Update password' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
</style>