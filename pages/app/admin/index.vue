<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {Button} from "@/components/ui/button";

definePageMeta({
  layout: 'home',
  middleware: ['authenticated', 'admin'],
})
</script>

<template>
  <div class="p-4">
    <Card class="relative w-5xl mx-auto">
      <CardHeader>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="icon" class="-ml-2" @click="navigateTo('/app/home')" aria-label="Go back">
            <i class="ri-arrow-left-line" aria-hidden="true"/>
          </Button>
          <CardTitle>Admin Interface</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink to="/app/admin/resources" class="group">
            <Card class="h-full transition-colors group-hover:border-primary">
              <div class="flex items-start gap-4 p-6">
                <i class="ri-folder-open-line text-2xl text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                <div>
                  <h3 class="font-medium">Resources</h3>
                  <p class="text-sm text-muted-foreground">Manage resources and assignments</p>
                </div>
              </div>
            </Card>
          </NuxtLink>

          <NuxtLink to="/app/admin/users" class="group">
            <Card class="h-full transition-colors group-hover:border-primary">
              <div class="flex items-start gap-4 p-6">
                <i class="ri-team-line text-2xl text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                <div>
                  <h3 class="font-medium">Users</h3>
                  <p class="text-sm text-muted-foreground">Manage users and roles</p>
                </div>
              </div>
            </Card>
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
</style>