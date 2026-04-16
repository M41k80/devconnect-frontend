'use client'

import { create } from 'zustand'
import { projectsApi } from '@/app/lib/api'

interface NotificationsState {
  pendingCount: number
  lastFetched:  number | null
  loading:      boolean
}

interface NotificationsActions {
  fetchPending: (userId: string) => Promise<void>
  decrement:    (by?: number) => void
  invalidate:   () => void   
  reset:        () => void
}

const CACHE_TTL = 60_000 

export const useNotificationsStore = create<NotificationsState & NotificationsActions>()(
  (set, get) => ({
    pendingCount: 0,
    lastFetched:  null,
    loading:      false,

    fetchPending: async (userId: string) => {
      const { lastFetched, loading } = get()
      if (loading) return
      if (lastFetched && Date.now() - lastFetched < CACHE_TTL) return

      set({ loading: true })
      try {
        const res   = await projectsApi.getAll({ limit: 100, page: 1 })
        const owned = res.data.filter((p) => p.owner.id === userId)

        if (owned.length === 0) {
          set({ pendingCount: 0, lastFetched: Date.now() })
          return
        }

        const results = await Promise.allSettled(
          owned.map((p) => projectsApi.getApplications(p.id, { limit: 50, page: 1 }))
        )

        let total = 0
        for (const r of results) {
          if (r.status === 'fulfilled') {
            total += r.value.data.filter((a) => a.status === 'pending').length
          }
        }
        set({ pendingCount: total, lastFetched: Date.now() })
      } catch {
        
      } finally {
        set({ loading: false })
      }
    },

    decrement: (by = 1) =>
      set((s) => ({ pendingCount: Math.max(0, s.pendingCount - by) })),

    invalidate: () => set({ lastFetched: null }),

    reset: () => set({ pendingCount: 0, lastFetched: null }),
  })
)
