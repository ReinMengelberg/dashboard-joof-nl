import { defineStore } from 'pinia'
import NotificationService from '../services/utils/NotificationService'
import ErrorService from '../services/utils/ErrorService'
import ResourceService, {
  type CreateResourceRequest,
  type UpdateResourceRequest,
  type ListResourcesParams,
} from '../services/api/ResourceService'
import type { Resource } from '@/src/types/models/resource'

// Lazy service instance
let resourceService: ResourceService | null = null

function ensureService() {
  if (!resourceService) resourceService = new ResourceService()
  return resourceService
}

export const useResourceStore = defineStore('ResourceStore', {
  state: () => ({
    // List state
    items: [] as Resource[],
    listLoading: false,
    query: '' as string,
    skip: 0 as number,
    take: 25 as number,

    // Active item state
    active: null as Resource | null,
    activeLoading: false,
  }),

  getters: {
    hasActive: (state) => !!state.active,
  },

  actions: {
    // LIST
    async fetchList(params: Partial<ListResourcesParams> = {}): Promise<boolean> {
      const service = ensureService()
      this.listLoading = true
      try {
        const q = params.q ?? this.query
        const skip = params.skip ?? this.skip
        const take = params.take ?? this.take
        const { data } = await service.list({ q, skip, take })
        this.items = data || []
        // persist latest params
        this.query = q ?? ''
        this.skip = skip ?? 0
        this.take = take ?? 25
        return true
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to load resources')
      } finally {
        this.listLoading = false
      }
    },

    // CREATE
    async create(request: CreateResourceRequest): Promise<boolean> {
      const service = ensureService()
      try {
        const { data } = await service.create(request)
        if (!data) new Error('Failed to create resource')
        NotificationService.showSuccess('Resource created')
        return true
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to create resource')
      }
    },

    // READ
    async view(resourceId: number): Promise<boolean> {
      const service = ensureService()
      this.activeLoading = true
      try {
        const { data } = await service.view(resourceId)
        if (!data) new Error('Failed to view resource')
        this.active = data
        return true
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to view resource')
      } finally {
        this.activeLoading = false
      }
    },

    // UPDATE
    async update(resourceId: number, request: UpdateResourceRequest): Promise<boolean> {
      const service = ensureService()
      try {
        const { data } = await service.update(resourceId, request)
        if (!data) new Error('Failed to update resource')
        this.active = data
        NotificationService.showSuccess('Resource updated')
        return true
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to update resource')
      }
    },

    // DELETE
    async destroy(resourceId: number, password?: string): Promise<boolean> {
      const service = ensureService()
      try {
        const { success } = await service.destroy(resourceId, password ? { password } : undefined)
        if (!success) new Error('Failed to delete resource')
        this.active = null
        NotificationService.showSuccess('Resource deleted')
        return true
      } catch (error: any) {
        return ErrorService.returnFalse(error, 'Failed to delete resource')
      }
    },
  },
})
