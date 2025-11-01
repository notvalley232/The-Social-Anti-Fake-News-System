import { createPinia } from 'pinia'

// Create and export the Pinia instance
export const pinia = createPinia()

// Export all stores
export { useNewsStore } from './newsStore'
export { useUserStore } from './userStore'
export { useUIStore } from './uiStore'
export { useSearchStore } from './searchStore'