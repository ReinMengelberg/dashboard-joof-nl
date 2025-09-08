<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableAction,
  TableEmpty,
} from '@/components/base/table';
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { useAuth } from "~/stores/auth";
import StackedDepartments from "~/components/models/department/StackedDepartments.vue";
import StackedLocations from "~/components/models/location/StackedLocations.vue";
import OnlineStatus from "~/components/models/user/OnlineStatus.vue";
import type { CompanyUser } from "~/src/types/models/company/company-user";
import ConfirmationDialog from "~/components/utils/dialog/ConfirmationDialog.vue";
import DeleteDialog from "~/components/utils/dialog/DeleteDialog.vue";
import TableSkeleton from "~/components/views/lists/TableSkeleton.vue";
import EmptyState from "~/components/views/lists/EmptyState.vue";
import Badge from "~/components/utils/Badge.vue";
import { getOptionColor, getOptionLabel } from "~/services/utils/OptionUtils";
import { getRawColor } from "~/services/utils/ColorUtils";
import { roleOptions } from "~/src/types/models/company/company-user";
import { Button } from "~/components/ui/button";
import Scrollable from "~/components/base/scrollarea/Scrollable.vue";
import { cn } from "@/lib/utils";

export interface DialogConfig {
  type: 'confirmation' | 'delete' | 'delete-password';
  condition?: boolean;
  triggerLabel?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
  action: (values: any) => Promise<any>;
  afterSuccess?: () => Promise<any>;
}

// To align with ContactTable, add a store-like `users` prop while keeping legacy props for backward compatibility.
import { useCompanyUsers } from "~/stores/company/companyUsers";

interface Props {
  view?: 'arrow' | 'actions';
  users: ReturnType<typeof useCompanyUsers>;
  selected?: CompanyUser | undefined;
  onItemClick?: (user: CompanyUser) => void | Promise<void>;
  dialogs?: DialogConfig[];

  // Authenticated badge and last seen status
  auth: ReturnType<typeof useAuth>;
  showYouBadge?: boolean;
  showLastSeen?: boolean;

  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  view: 'arrow',
  showYouBadge: true,
  showLastSeen: true,
  dialogs: () => [],
});

const emit = defineEmits<{ (e: 'select', user: CompanyUser): void }>()


const handleSelect = (user: CompanyUser) => {
  emit('select', user)
  props.onItemClick?.(user)
}

</script>

<template>
  <Scrollable
      class="h-full"
      max-height="100%"
      :class="props.class"
  >
    <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-3/12">User</TableHead>
        <TableHead class="w-2/12">Role</TableHead>
        <TableHead class="w-3/12" v-if="props.view !== 'actions'">Departments</TableHead>
        <TableHead class="w-3/12" v-if="props.view !== 'actions'">Locations</TableHead>
        <TableHead class="w-1/12" v-if="props.showLastSeen">Status</TableHead>
        <TableHead class="w-1/12"></TableHead>
      </TableRow>
    </TableHeader>

    <!-- Match ContactTable: show Skeleton/Empty outside of TableBody -->
    <TableSkeleton v-if="props.users.listLoading"
      :rows="props.users.per_page"
      :cols="6"
    />
    <TableEmpty v-else-if="!props.users.listLoading && (!props.users.list?.data || props.users.list?.data?.length === 0)" :colspan="6">
      <EmptyState
        empty-message="No users found"
        empty-prompt="Try adjusting your search or filters..."
        icon="ri-user-community-line"
      />
    </TableEmpty>

    <TableBody v-else>
      <TableRow
        v-for="user in props.users.list?.data"
        :key="user.email"
        :class="cn('cursor-pointer transition-all duration-200 ease-in-out hover:bg-sky-100 dark:hover:bg-sky-800 text-gray-700 dark:text-gray-300 !border-t-0 !border-l-4 !border-white', props.selected?.id === user.id && 'bg-blue-100 text-blue-600 dark:bg-blue-800/30 dark:text-blue-300 !border-b-0 !border-l-4 !border-blue-500')"
        @click="props.view === 'arrow' ? handleSelect(user) : undefined"
      >
      <!-- User Column -->
      <TableCell>
        <div class="flex items-center gap-x-3">
          <Avatar class="h-12 w-12 flex-shrink-0 rounded-full bg-gray-50 ring-1 ring-gray-200">
            <AvatarImage :src="user.avatar?.temp_url"/>
            <AvatarFallback class="text-base font-medium">
              {{ user.name.split(' ').map((n: string) => n.charAt(0)).join('').toUpperCase() }}
            </AvatarFallback>
          </Avatar>
          <div class="min-w-0 flex-1">
            <div class="flex users-center gap-2">
              <p class="text-sm font-semibold text-gray-900 truncate">
                {{ user.name }}
              </p>
              <!-- You Badge -->
              <Badge v-if="props.showYouBadge && props.auth.user?.global_id === user.global_id" color="blue">
                <span>You</span>
              </Badge>
            </div>
            <p class="mt-1 text-xs text-gray-500 truncate">
              <a :href="`mailto:${user.email}`" class="hover:text-blue-600">
                {{ user.email }}
              </a>
            </p>
          </div>
        </div>
      </TableCell>

      <!-- Role Column -->
      <TableCell>
        <Badge v-if="user.role" :color="getRawColor(getOptionColor(user.role, roleOptions))">
          <span>{{ getOptionLabel(user.role, roleOptions) }}</span>
        </Badge>
        <span v-else class="text-sm text-gray-500">-</span>
      </TableCell>

      <!-- Department Column -->
      <TableCell v-if="props.view !== 'actions'">
        <div class="flex items-center justify-start">
        <StackedDepartments
          :departments="user.departments"
          size="small"
        />
        </div>
      </TableCell>

      <!-- Locations Column -->
      <TableCell v-if="props.view !== 'actions'">
        <div class="flex items-center justify-start">
          <StackedLocations
              :locations="user.locations"
              size="small"
          />
        </div>
      </TableCell>

      <!-- Status Column -->
      <TableCell v-if="props.showLastSeen">
        <OnlineStatus
            :user="user"
        />
      </TableCell>

      <!-- Actions Column -->
      <TableCell class="text-right" @click.prevent>
        <TableAction v-if="props.view === 'arrow'" :action="() => handleSelect(user)" />
        <div v-else>
          <div class="flex shrink-0 items-center justify-end gap-x-5">
            <span class="relative z-10">
              <Button
                  variant="outline"
                  @click="handleSelect(user)"
                >
                  View User
              </Button>
            </span>

            <template v-for="(dialog, index) in props.dialogs" :key="index">
            <div v-if="dialog.condition" class="flex shrink-0 items-center justify-end gap-x-10">
              <span class="relative z-10">
                <!-- Unassign Dialog -->
                <DeleteDialog
                    v-if="dialog.type === 'delete'"
                    :triggerLabel="dialog.triggerLabel"
                    :title="dialog.title"
                    :description="dialog.description"
                    :actionLabel="dialog.actionLabel"
                    :cancelLabel="dialog.cancelLabel"
                    :action="(...args) => dialog.action(user, ...args)"
                    :afterSuccess="dialog.afterSuccess"
                />

                <!-- Assign Dialog -->
                <ConfirmationDialog
                    v-else-if="dialog.type === 'confirmation'"
                    :triggerLabel="dialog.triggerLabel"
                    :title="dialog.title"
                    :description="dialog.description"
                    :actionLabel="dialog.actionLabel"
                    :cancelLabel="dialog.cancelLabel"
                    :action="(...args) => dialog.action(user, ...args)"
                    :afterSuccess="dialog.afterSuccess"
                />
              </span>
            </div>
          </template>
          </div>
        </div>
      </TableCell>
    </TableRow>
    </TableBody>
  </Table>
  </Scrollable>
</template>

<style scoped>

</style>