import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  username?: string
  email: string
  avatar?: string
  role: 'READER' | 'MEMBER' | 'ADMIN'
  joinedAt: string
  votesCount: number
  submissionsCount: number
  reputation: number
}

interface UserVote {
  newsId: string
  voteType: 'real' | 'fake'
  votedAt: string
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'en' | 'zh'
  notifications: {
    email: boolean
    push: boolean
    newsUpdates: boolean
    voteResults: boolean
  }
  privacy: {
    showProfile: boolean
    showVotes: boolean
    showSubmissions: boolean
  }
}

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const userVotes = ref<UserVote[]>([])
  const userPreferences = ref<UserPreferences>({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      newsUpdates: true,
      voteResults: false
    },
    privacy: {
      showProfile: true,
      showVotes: false,
      showSubmissions: true
    }
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const userRole = computed(() => currentUser.value?.role || null)
  
  const isAdmin = computed(() => userRole.value === 'ADMIN')
  
  const isModerator = computed(() => ['ADMIN'].includes(userRole.value))
  
  const userStats = computed(() => {
    if (!currentUser.value) return null
    
    return {
      votesCount: currentUser.value.votesCount,
      submissionsCount: currentUser.value.submissionsCount,
      reputation: currentUser.value.reputation,
      joinedDays: Math.floor(
        (Date.now() - new Date(currentUser.value.joinedAt).getTime()) / (1000 * 60 * 60 * 24)
      )
    }
  })

  const hasVotedOnNews = computed(() => (newsId: string) => {
    return userVotes.value.find(vote => vote.newsId === newsId)
  })

  const getUserVoteType = computed(() => (newsId: string) => {
    const vote = userVotes.value.find(vote => vote.newsId === newsId)
    return vote?.voteType || null
  })

  const getUserVoteForNews = computed(() => (newsId: string) => {
    return userVotes.value.find(vote => vote.newsId === newsId)
  })

  // Actions
  const login = async (credentials: { email: string; password: string }) => {
    try {
      loading.value = true
      error.value = null
      const { dataService } = await import('@/services/dataService')
      const res = await dataService.login(credentials.email, credentials.password)
      const user: User = {
        id: res.user.id,
        email: res.user.email,
        avatar: res.user.avatarUrl,
        role: res.user.role,
        joinedAt: res.user.createdAt,
        username: res.user.firstName,
        votesCount: 0,
        submissionsCount: 0,
        reputation: 0
      }
      currentUser.value = user
      isAuthenticated.value = true
      loadUserPreferences()
      loadUserVotes()
      localStorage.setItem('current_user', JSON.stringify(user))
      return { success: true, user }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    avatarFile: File
  }) => {
    try {
      loading.value = true
      error.value = null
      const { dataService } = await import('@/services/dataService')
      const avatarUrl = await dataService.uploadImage(userData.avatarFile)
      const res = await dataService.register({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        avatarUrl
      })
      const user: User = {
        id: res.user.id,
        email: res.user.email,
        avatar: res.user.avatarUrl,
        role: res.user.role,
        joinedAt: res.user.createdAt,
        username: res.user.firstName,
        votesCount: 0,
        submissionsCount: 0,
        reputation: 0
      }
      currentUser.value = user
      isAuthenticated.value = true
      localStorage.setItem('current_user', JSON.stringify(user))
      return { success: true, user }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      const { dataService } = await import('@/services/dataService')
      await dataService.logout()
    } catch {}
    currentUser.value = null
    isAuthenticated.value = false
    userVotes.value = []
    localStorage.removeItem('user_preferences')
    localStorage.removeItem('user_votes')
    localStorage.removeItem('current_user')
    localStorage.removeItem('auth_token')
    clearError()
    return { success: true }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      loading.value = true
      error.value = null

      if (!currentUser.value) {
        throw new Error('User not authenticated')
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Update user data
      currentUser.value = { ...currentUser.value, ...profileData }

      return { success: true, user: currentUser.value }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Profile update failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    userPreferences.value = { ...userPreferences.value, ...newPreferences }
    saveUserPreferences()
  }

  const recordVote = (newsId: string, voteType: 'real' | 'fake') => {
    // Remove existing vote for this news if any
    userVotes.value = userVotes.value.filter(vote => vote.newsId !== newsId)
    
    // Add new vote
    userVotes.value.push({
      newsId,
      voteType,
      votedAt: new Date().toISOString()
    })

    // Update user stats
    if (currentUser.value) {
      currentUser.value.votesCount++
      currentUser.value.reputation += 1
    }

    // Save to localStorage
    saveUserVotes()
  }

  const removeVote = (newsId: string) => {
    const voteIndex = userVotes.value.findIndex(vote => vote.newsId === newsId)
    if (voteIndex !== -1) {
      userVotes.value.splice(voteIndex, 1)
      
      // Update user stats
      if (currentUser.value) {
        currentUser.value.votesCount = Math.max(0, currentUser.value.votesCount - 1)
        currentUser.value.reputation = Math.max(0, currentUser.value.reputation - 1)
      }

      saveUserVotes()
    }
  }

  const incrementSubmissions = () => {
    if (currentUser.value) {
      currentUser.value.submissionsCount++
      currentUser.value.reputation += 5
    }
  }

  // Local storage helpers
  const saveUserPreferences = () => {
    localStorage.setItem('user_preferences', JSON.stringify(userPreferences.value))
  }

  const loadUserPreferences = () => {
    const stored = localStorage.getItem('user_preferences')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        userPreferences.value = { ...userPreferences.value, ...parsed }
      } catch (err) {
        console.error('Failed to parse user preferences:', err)
      }
    }
  }

  const saveUserVotes = () => {
    localStorage.setItem('user_votes', JSON.stringify(userVotes.value))
  }

  const loadUserVotes = () => {
    const stored = localStorage.getItem('user_votes')
    if (stored) {
      try {
        userVotes.value = JSON.parse(stored)
      } catch (err) {
        console.error('Failed to parse user votes:', err)
      }
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize user data from localStorage on store creation
  const initializeUser = () => {
    loadUserPreferences()
    
    // Check if user was previously logged in (in a real app, this would validate a token)
    const storedUser = localStorage.getItem('current_user')
    if (storedUser) {
      try {
        currentUser.value = JSON.parse(storedUser)
        isAuthenticated.value = true
        loadUserVotes()
      } catch (err) {
        console.error('Failed to restore user session:', err)
        localStorage.removeItem('current_user')
      }
    }
  }

  // Auto-save current user to localStorage
  const saveCurrentUser = () => {
    if (currentUser.value) {
      localStorage.setItem('current_user', JSON.stringify(currentUser.value))
    } else {
      localStorage.removeItem('current_user')
    }
  }

  return {
    // State
    currentUser,
    isAuthenticated,
    userVotes,
    userPreferences,
    loading,
    error,

    // Getters
    userRole,
    isAdmin,
    isModerator,
    userStats,
    hasVotedOnNews,
    getUserVoteType,
    getUserVoteForNews,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    recordVote,
    removeVote,
    incrementSubmissions,
    clearError,
    initializeUser,
    saveCurrentUser
  }
})
