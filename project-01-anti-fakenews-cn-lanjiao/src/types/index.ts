// News related types
export interface News {
  id: string
  title: string
  summary: string
  content: string
  imageUrl: string
  category: string
  status: 'real' | 'fake' | 'pending'
  reporter: string
  createdAt: string
  submittedBy?: string
  submittedAt?: string
  verifiedAt?: string
  sourceUrl?: string
  votes?: {
    real: number
    fake: number
    pending: number
  }
  realVotes: number
  fakeVotes: number
  confidence?: number
  isFake?: boolean
  tags?: string[]
  views?: number
  shares?: number
}

// Comment related types
export interface Comment {
  id: string
  newsId: string
  author: string
  content: string
  voteType: 'real' | 'fake'
  createdAt: string
  userId?: string
  username?: string
  avatar?: string
  votes?: {
    helpful: number
    unhelpful: number
  }
  verified?: boolean
  expertise?: string
}

// User related types
export interface User {
  id: string
  username: string
  email: string
  avatar: string
  role: 'user' | 'moderator' | 'admin' | 'expert'
  expertise?: string[]
  institution?: string
  joinedAt: string
  stats: {
    newsSubmitted: number
    votesGiven: number
    commentsPosted: number
    accuracyScore: number
    reputation: number
  }
  badges: string[]
  verified: boolean
  preferences: {
    emailNotifications: boolean
    categories: string[]
    theme: 'light' | 'dark'
  }
}

// Vote related types
export interface Vote {
  id: string
  newsId: string
  userId: string
  voteType: 'real' | 'fake'
  createdAt: string
  confidence?: number
}

// Search related types
export interface SearchFilters {
  category?: string
  status?: string
  dateRange?: {
    start: string
    end: string
  }
  sortBy?: 'relevance' | 'date' | 'votes'
}

export interface SearchResult {
  news: News[]
  total: number
  page: number
  pageSize: number
}

// Navigation related types
export interface NavigationItem {
  label: string
  path: string
  icon?: string
  isCustomAction?: boolean
}

// Filter configuration types
export interface FilterConfig {
  category: string
  status: string
  dateRange: string
  sortBy: string
}

// Pagination configuration types
export interface PaginationConfig {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// Video header props types
export interface VideoHeaderProps {
  videoUrl?: string
  overlayOpacity?: number
  showNavigation?: boolean
  showSearchBar?: boolean
}