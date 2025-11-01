// Data service for handling JSON data and future API integration
import type { News, Comment, Vote } from '@/types'

// Import JSON data (fallback for local development)
import newsData from '@/data/mockNews.json'
import commentsData from '@/data/mockComments.json'
import votesData from '@/data/mockVotes.json'

export class DataService {
  private static instance: DataService
  private apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
  private useExternalAPI: boolean = import.meta.env.VITE_USE_EXTERNAL_API === 'true' || false

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

  // Local JSON data loading methods (fallback)
  private async loadNewsDataFromJSON(): Promise<News[]> {
    try {
      // Simulate API delay for realistic behavior
      await new Promise(resolve => setTimeout(resolve, 300))
      return newsData.news as News[]
    } catch (error) {
      console.error('Error loading news data from JSON:', error)
      throw new Error('Failed to load news data from JSON')
    }
  }

  private async loadCommentsDataFromJSON(): Promise<Comment[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      return commentsData.comments as Comment[]
    } catch (error) {
      console.error('Error loading comments data from JSON:', error)
      throw new Error('Failed to load comments data from JSON')
    }
  }

  private async loadVotesDataFromJSON(): Promise<Vote[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      return votesData.votes as Vote[]
    } catch (error) {
      console.error('Error loading votes data from JSON:', error)
      throw new Error('Failed to load votes data from JSON')
    }
  }

  // API data loading methods
  private async fetchFromAPI(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('API fetch error:', error)
      throw new Error(`Failed to fetch from API: ${endpoint}`)
    }
  }

  private async loadNewsDataFromAPI(): Promise<News[]> {
    const data = await this.fetchFromAPI('/mockNews.json')
    return data.news || data // Handle both {news: [...]} and [...] formats
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

  // Unified data loading methods with fallback
  async loadNewsData(): Promise<News[]> {
    if (this.useExternalAPI) {
      try {
        return await this.loadNewsDataFromAPI()
      } catch (error) {
        console.warn('Failed to load from external API, falling back to local JSON:', error)
        return await this.loadNewsDataFromJSON()
      }
    } else {
      return await this.loadNewsDataFromJSON()
    }
  }

  async loadCommentsData(): Promise<Comment[]> {
    if (this.useExternalAPI) {
      try {
        return await this.loadCommentsDataFromAPI()
      } catch (error) {
        console.warn('Failed to load from external API, falling back to local JSON:', error)
        return await this.loadCommentsDataFromJSON()
      }
    } else {
      return await this.loadCommentsDataFromJSON()
    }
  }

  async loadVotesData(): Promise<Vote[]> {
    if (this.useExternalAPI) {
      try {
        return await this.loadVotesDataFromAPI()
      } catch (error) {
        console.warn('Failed to load from external API, falling back to local JSON:', error)
        return await this.loadVotesDataFromJSON()
      }
    } else {
      return await this.loadVotesDataFromJSON()
    }
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
    const allVotes = await this.loadVotesData()
    return allVotes.filter(vote => vote.newsId === newsId)
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
    const response = await fetch(`${this.apiBaseUrl}/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newsId, voteType, createdAt: new Date().toISOString() })
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit vote')
    }
    
    return response.json()
  }

  async submitCommentToAPI(newsId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const response = await fetch(`${this.apiBaseUrl}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...comment, newsId, createdAt: new Date().toISOString() })
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit comment')
    }
    
    return response.json()
  }

  async submitNewsToAPI(news: Omit<News, 'id' | 'createdAt' | 'status' | 'fakeVotes' | 'realVotes'>): Promise<News> {
    const response = await fetch(`${this.apiBaseUrl}/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
    if (this.useExternalAPI) {
      try {
        return await this.submitVoteToAPI(voteData.newsId, voteData.voteType)
      } catch (error) {
        console.warn('Failed to submit vote to API, using local simulation:', error)
      }
    }
    
    // Local simulation fallback
    const newVote: Vote = {
      id: Date.now().toString(),
      newsId: voteData.newsId,
      userId: 'current-user', // This would come from auth
      voteType: voteData.voteType,
      createdAt: voteData.createdAt
    }
    return newVote
  }

  async submitNews(news: Omit<News, 'id' | 'createdAt' | 'status' | 'fakeVotes' | 'realVotes'>): Promise<News> {
    if (this.useExternalAPI) {
      try {
        return await this.submitNewsToAPI(news)
      } catch (error) {
        console.warn('Failed to submit news to API, using local simulation:', error)
      }
    }
    
    // Local simulation fallback
    const newNews: News = {
      ...news,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending' as const,
      fakeVotes: 0,
      realVotes: 0
    }
    return newNews
  }

  async submitComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    if (this.useExternalAPI) {
      try {
        return await this.submitCommentToAPI(comment.newsId, comment)
      } catch (error) {
        console.warn('Failed to submit comment to API, using local simulation:', error)
      }
    }
    
    // Local simulation fallback
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    return newComment
  }
}

// Export singleton instance
export const dataService = DataService.getInstance()