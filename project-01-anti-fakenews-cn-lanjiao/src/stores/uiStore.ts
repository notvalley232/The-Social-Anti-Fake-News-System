import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

interface Modal {
  id: string
  component: string
  props?: Record<string, any>
  persistent?: boolean
}

interface Notification {
  id: string
  type: 'news_update' | 'vote_result' | 'comment_reply' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

export const useUIStore = defineStore('ui', () => {
  // State
  const theme = ref<'light' | 'dark' | 'auto'>('light')
  const sidebarOpen = ref(false)
  const mobileMenuOpen = ref(false)
  const loading = ref(false)
  const loadingMessage = ref('')
  const toasts = ref<Toast[]>([])
  const modals = ref<Modal[]>([])
  const notifications = ref<Notification[]>([])
  const searchQuery = ref('')
  const searchFilters = ref({
    category: 'all',
    status: 'all',
    dateRange: 'all',
    sortBy: 'date'
  })

  // Responsive breakpoints
  const screenWidth = ref(window.innerWidth)
  const screenHeight = ref(window.innerHeight)

  // Getters
  const isDarkMode = computed(() => {
    if (theme.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme.value === 'dark'
  })

  const isMobile = computed(() => screenWidth.value < 768)
  const isTablet = computed(() => screenWidth.value >= 768 && screenWidth.value < 1024)
  const isDesktop = computed(() => screenWidth.value >= 1024)

  const unreadNotifications = computed(() => 
    notifications.value.filter(notification => !notification.read)
  )

  const unreadNotificationCount = computed(() => unreadNotifications.value.length)

  const currentToasts = computed(() => 
    toasts.value.filter(toast => !toast.persistent || Date.now() - parseInt(toast.id) < (toast.duration || 5000))
  )

  const activeModal = computed(() => modals.value[modals.value.length - 1] || null)

  // Actions
  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    updateThemeClass()
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const updateThemeClass = () => {
    const html = document.documentElement
    if (isDarkMode.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const closeSidebar = () => {
    sidebarOpen.value = false
  }

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  const closeMobileMenu = () => {
    mobileMenuOpen.value = false
  }

  const setLoading = (isLoading: boolean, message = '') => {
    loading.value = isLoading
    loadingMessage.value = message
  }

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString()
    const newToast: Toast = {
      id,
      duration: 5000,
      persistent: false,
      ...toast
    }

    toasts.value.push(newToast)

    // Auto-remove toast after duration
    if (!newToast.persistent) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  const showSuccessToast = (title: string, message?: string) => {
    return showToast({ type: 'success', title, message })
  }

  const showErrorToast = (title: string, message?: string) => {
    return showToast({ type: 'error', title, message })
  }

  const showWarningToast = (title: string, message?: string) => {
    return showToast({ type: 'warning', title, message })
  }

  const showInfoToast = (title: string, message?: string) => {
    return showToast({ type: 'info', title, message })
  }

  const openModal = (modal: Omit<Modal, 'id'>) => {
    const id = Date.now().toString()
    const newModal: Modal = { id, ...modal }
    modals.value.push(newModal)
    return id
  }

  const closeModal = (id?: string) => {
    if (id) {
      const index = modals.value.findIndex(modal => modal.id === id)
      if (index !== -1) {
        modals.value.splice(index, 1)
      }
    } else {
      // Close the topmost modal
      modals.value.pop()
    }
  }

  const closeAllModals = () => {
    modals.value = []
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      id,
      read: false,
      createdAt: new Date().toISOString(),
      ...notification
    }

    notifications.value.unshift(newNotification)

    // Keep only the latest 50 notifications
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }

    return id
  }

  const markNotificationAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const markAllNotificationsAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true
    })
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setSearchFilters = (filters: Partial<typeof searchFilters.value>) => {
    searchFilters.value = { ...searchFilters.value, ...filters }
  }

  const clearSearch = () => {
    searchQuery.value = ''
    searchFilters.value = {
      category: 'all',
      status: 'all',
      dateRange: 'all',
      sortBy: 'date'
    }
  }

  const updateScreenSize = () => {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
  }

  // Initialize theme from localStorage
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null
    if (savedTheme) {
      theme.value = savedTheme
    }
    updateThemeClass()
  }

  // Initialize screen size listener
  const initializeScreenSize = () => {
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
  }

  // Cleanup
  const cleanup = () => {
    window.removeEventListener('resize', updateScreenSize)
  }

  // Keyboard shortcuts
  const handleKeyboardShortcuts = (event: KeyboardEvent) => {
    // Escape key to close modals/menus
    if (event.key === 'Escape') {
      if (modals.value.length > 0) {
        closeModal()
      } else if (mobileMenuOpen.value) {
        closeMobileMenu()
      } else if (sidebarOpen.value) {
        closeSidebar()
      }
    }

    // Ctrl/Cmd + K for search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      // Trigger search modal or focus search input
      openModal({ component: 'SearchModal' })
    }

    // Ctrl/Cmd + D for theme toggle
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
      event.preventDefault()
      toggleTheme()
    }
  }

  const initializeKeyboardShortcuts = () => {
    document.addEventListener('keydown', handleKeyboardShortcuts)
  }

  const cleanupKeyboardShortcuts = () => {
    document.removeEventListener('keydown', handleKeyboardShortcuts)
  }

  return {
    // State
    theme,
    sidebarOpen,
    mobileMenuOpen,
    loading,
    loadingMessage,
    toasts,
    modals,
    notifications,
    searchQuery,
    searchFilters,
    screenWidth,
    screenHeight,

    // Getters
    isDarkMode,
    isMobile,
    isTablet,
    isDesktop,
    unreadNotifications,
    unreadNotificationCount,
    currentToasts,
    activeModal,

    // Actions
    setTheme,
    toggleTheme,
    updateThemeClass,
    toggleSidebar,
    closeSidebar,
    toggleMobileMenu,
    closeMobileMenu,
    setLoading,
    showToast,
    removeToast,
    clearAllToasts,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    openModal,
    closeModal,
    closeAllModals,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    clearAllNotifications,
    setSearchQuery,
    setSearchFilters,
    clearSearch,
    updateScreenSize,
    initializeTheme,
    initializeScreenSize,
    cleanup,
    initializeKeyboardShortcuts,
    cleanupKeyboardShortcuts
  }
})