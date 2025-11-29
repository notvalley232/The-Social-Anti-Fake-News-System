// Data service for handling JSON data and future API integration
import type { News, Comment, Vote } from '@/types'

export class DataService {
  private static instance: DataService
  private apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'
  private useExternalAPI: boolean = true
  private token: string | null = null

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance
  }

  // Configuration methods
  setAPIBaseUrl(url: string): void {
    this.apiBaseUrl = url
  }

  setUseExternalAPI(useExternal: boolean): void {
    this.useExternalAPI = useExternal
  }

  getAPIBaseUrl(): string {
    return this.apiBaseUrl
  }

  isUsingExternalAPI(): boolean {
    return this.useExternalAPI
  }

  setToken(token: string | null): void {
    this.token = token
    if (token) localStorage.setItem('auth_token', token)
    else localStorage.removeItem('auth_token')
  }

  // Local JSON loading removed

  // API data loading methods
  private async fetchFromAPI(endpoint: string): Promise<any> {
    try {
      const headers: Record<string, string> = {}
      if (this.token) headers['Authorization'] = `Bearer ${this.token}`
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, { headers })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('API fetch error:', error)
      throw new Error(`Failed to fetch from API: ${endpoint}`)
    }
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const headers: Record<string, string> = {}
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`
    const res = await fetch(`${this.apiBaseUrl}/uploadImage`, {
      method: 'POST',
      body: formData,
      headers
    })
    if (!res.ok) {
      throw new Error('Failed to upload image')
    }
    const data = await res.json()
    if (typeof data?.name === 'string') {
      return data.name
    }
    if (Array.isArray(data) && data[0]?.name) {
      return data[0].name
    }
    throw new Error('Invalid upload response')
  }

  private async loadNewsDataFromAPI(): Promise<News[]> {
    const data = await this.fetchFromAPI('/mockNews.json')
    return data.news || data // Handle both {news: [...]} and [...] formats
  }

  async searchNewsByTitle(query: string): Promise<News[]> {
    const res = await this.fetchFromAPI(`/news/search?q=${encodeURIComponent(query)}`)
    return Array.isArray(res) ? res : (res.news || [])
  }

  private async loadCommentsDataFromAPI(): Promise<Comment[]> {
    const data = await this.fetchFromAPI('/mockComments.json')
    return data.comments || data // Handle both {comments: [...]} and [...] formats
  }

  private async loadVotesDataFromAPI(): Promise<Vote[]> {
    const data = await this.fetchFromAPI('/mockVotes.json')
    return data.votes || data // Handle both {votes: [...]} and [...] formats
  }

  private async loadUsersDataFromAPI(): Promise<any[]> {
    const data = await this.fetchFromAPI('/mockUsers.json')
    return data.users || data // Handle both {users: [...]} and [...] formats
  }

  // Unified data loading methods
  async loadNewsData(): Promise<News[]> {
    return await this.loadNewsDataFromAPI()
  }

  async loadCommentsData(): Promise<Comment[]> {
    return await this.loadCommentsDataFromAPI()
  }

  async loadVotesData(): Promise<Vote[]> {
    return await this.loadVotesDataFromAPI()
  }

  async loadUsersData(): Promise<any[]> {
    if (this.useExternalAPI) {
      try {
        return await this.loadUsersDataFromAPI()
      } catch (error) {
        console.warn('Failed to load users from external API, falling back to local JSON:', error)
        // For now, return empty array as fallback since we don't have local users data
        return []
      }
    } else {
      // Return empty array for local mode since we don't have local users data
      return []
    }
  }

  // Get news by ID
  async getNewsById(id: string): Promise<News | null> {
    try {
      console.log('DataService: Looking for news with ID:', id)
      const allNews = await this.loadNewsData()
      console.log('DataService: Total news loaded:', allNews.length)
      console.log('DataService: Available news IDs:', allNews.map(n => n.id))
      
      const foundNews = allNews.find(news => news.id === id)
      console.log('DataService: Found news:', foundNews ? 'Yes' : 'No')
      
      return foundNews || null
    } catch (error) {
      console.error('DataService: Error in getNewsById:', error)
      throw error
    }
  }

  // Get comments for specific news
  async getCommentsByNewsId(newsId: string): Promise<Comment[]> {
    const allComments = await this.loadCommentsData()
    return allComments.filter(comment => comment.newsId === newsId)
  }

  // Get votes for specific news
  async getVotesByNewsId(newsId: string): Promise<Vote[]> {
    const allVotes = await this.loadVotesDataFromAPI()
    return allVotes.filter(vote => vote.newsId === newsId)
  }

  async getVoteStatus(newsId: string): Promise<{ voted: boolean; voteType?: 'real' | 'fake' }> {
    const headers: Record<string, string> = {}
    const token = this.token || localStorage.getItem('auth_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${this.apiBaseUrl}/votes/status?newsId=${encodeURIComponent(newsId)}`, { headers })
    if (!res.ok) throw new Error('Failed to fetch vote status')
    return await res.json()
  }

  // Filter news by status
  async getNewsByStatus(status: 'all' | 'fake' | 'real' | 'pending'): Promise<News[]> {
    const allNews = await this.loadNewsData()
    if (status === 'all') {
      return allNews
    }
    return allNews.filter(news => news.status === status)
  }

  // Pagination helper
  async getNewsPaginated(page: number, pageSize: number, status: 'all' | 'fake' | 'real' | 'pending' = 'all'): Promise<{
    news: News[]
    total: number
    totalPages: number
    currentPage: number
    pageSize: number
  }> {
    const filteredNews = await this.getNewsByStatus(status)
    const total = filteredNews.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedNews = filteredNews.slice(startIndex, endIndex)

    return {
      news: paginatedNews,
      total,
      totalPages,
      currentPage: page,
      pageSize
    }
  }

  // API submission methods
  async submitVoteToAPI(newsId: string, voteType: 'real' | 'fake'): Promise<Vote> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`
    const response = await fetch(`${this.apiBaseUrl}/votes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ newsId, voteType, createdAt: new Date().toISOString() })
    })
    
    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('ALREADY_VOTED')
      }
      throw new Error('Failed to submit vote')
    }
    
    return response.json()
  }

  async submitCommentToAPI(newsId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`
    const response = await fetch(`${this.apiBaseUrl}/comments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...comment, newsId, createdAt: new Date().toISOString() })
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit comment')
    }
    
    return response.json()
  }

  async submitNewsToAPI(news: Omit<News, 'id' | 'createdAt' | 'status' | 'fakeVotes' | 'realVotes'>): Promise<News> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`
    const response = await fetch(`${this.apiBaseUrl}/news`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        ...news, 
        createdAt: new Date().toISOString(),
        status: 'pending',
        fakeVotes: 0,
        realVotes: 0
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit news')
    }
    
    return response.json()
  }

  async updateNewsToAPI(id: string, news: Partial<News>): Promise<News> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const token = this.token || localStorage.getItem('auth_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
    const response = await fetch(`${this.apiBaseUrl}/news/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(news)
    })
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(`Failed to update news (${response.status}): ${text}`)
    }
    return await response.json()
  }

  // Wrapper methods for current implementation
  async getAllNews(): Promise<News[]> {
    return this.loadNewsData()
  }

  async getNewsByCategory(category: string): Promise<News[]> {
    const allNews = await this.loadNewsData()
    return allNews.filter(news => news.category === category)
  }

  async fetchCommentsByNewsId(newsId: string): Promise<Comment[]> {
    return this.getCommentsByNewsId(newsId)
  }

  async submitVote(voteData: { newsId: string; voteType: 'real' | 'fake'; createdAt: string }): Promise<Vote> {
    return await this.submitVoteToAPI(voteData.newsId, voteData.voteType)
  }

  async submitNews(news: Omit<News, 'id' | 'createdAt' | 'status' | 'fakeVotes' | 'realVotes'>): Promise<News> {
    return await this.submitNewsToAPI(news)
  }

  async updateNews(id: string, news: Partial<News>): Promise<News> {
    return await this.updateNewsToAPI(id, news)
  }

  async submitComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    return await this.submitCommentToAPI(comment.newsId, comment)
  }

  async deleteNews(id: string): Promise<void> {
    const headers: Record<string, string> = {}
    const token = this.token || localStorage.getItem('auth_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${this.apiBaseUrl}/news/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers
    })
    if (!res.ok && res.status !== 204) {
      throw new Error('Failed to delete news')
    }
  }

  async deleteComment(id: string): Promise<void> {
    const headers: Record<string, string> = {}
    const token = this.token || localStorage.getItem('auth_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${this.apiBaseUrl}/admin/comments/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers
    })
    if (!res.ok && res.status !== 204) {
      throw new Error('Failed to delete comment')
    }
  }

  async deleteVote(id: string): Promise<void> {
    const headers: Record<string, string> = {}
    const token = this.token || localStorage.getItem('auth_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${this.apiBaseUrl}/admin/votes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers
    })
    if (!res.ok && res.status !== 204) {
      throw new Error('Failed to delete vote')
    }
  }

  async fetchAllUsers(): Promise<any[]> {
    const headers: Record<string, string> = {}
    const token = this.token || localStorage.getItem('auth_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${this.apiBaseUrl}/admin/users`, { headers })
    if (!res.ok) throw new Error('Failed to load users')
    return await res.json()
  }

  async updateUserRole(userId: string, role: 'READER' | 'MEMBER' | 'ADMIN'): Promise<{ id: string; role: string }> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const token = this.token || localStorage.getItem('auth_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${this.apiBaseUrl}/admin/users/${encodeURIComponent(userId)}/role`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ role })
    })
    if (!res.ok) throw new Error('Failed to update user role')
    return await res.json()
  }

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch(`${this.apiBaseUrl}/auth/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) throw new Error('Login failed')
    const data = await res.json()
    this.setToken(data.accessToken)
    return { token: data.accessToken, user: data.user }
  }

  async register(payload: { firstName: string; lastName: string; email: string; password: string; avatarUrl: string }): Promise<{ token: string; user: any }> {
    const res = await fetch(`${this.apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Registration failed')
    const data = await res.json()
    this.setToken(data.accessToken)
    return { token: data.accessToken, user: data.user }
  }

  async logout(): Promise<void> {
    const headers: Record<string, string> = {}
    const token = this.token || localStorage.getItem('auth_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
    await fetch(`${this.apiBaseUrl}/auth/logout`, { method: 'POST', headers })
    this.setToken(null)
  }
}

// Export singleton instance
export const dataService = DataService.getInstance()
