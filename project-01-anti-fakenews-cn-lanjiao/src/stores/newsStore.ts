import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DataService } from '@/services/dataService'
import type { News, Comment, Vote, PaginationConfig, FilterConfig } from '@/types'

export const useNewsStore = defineStore('news', () => {
  // State
  const newsList = ref<News[]>([])
  const currentNews = ref<News | null>(null)
  const comments = ref<Comment[]>([])
  const votes = ref<Vote[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination and filtering
  const currentPage = ref(1)
  const pageSize = ref(12)
  const totalCount = ref(0)
  const activeCategory = ref('all')
  const activeStatus = ref('all')
  const sortBy = ref<'date' | 'votes' | 'relevance'>('date')
  const sortOrder = ref<'asc' | 'desc'>('desc')

  // Data service instance
  const dataService = DataService.getInstance()

  // Getters
  const filteredNews = computed(() => {
    let filtered = [...newsList.value]

    // Filter by category
    if (activeCategory.value !== 'all') {
      filtered = filtered.filter(news => news.category === activeCategory.value)
    }

    // Filter by status
    if (activeStatus.value !== 'all') {
      filtered = filtered.filter(news => news.status === activeStatus.value)
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy.value) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'votes':
          const aVotes = a.realVotes + a.fakeVotes
          const bVotes = b.realVotes + b.fakeVotes
          comparison = aVotes - bVotes
          break
        case 'relevance':
          // For relevance, we could implement a scoring algorithm
          // For now, we'll use a combination of votes and recency
          const aScore = (a.realVotes + a.fakeVotes) * 0.7 + (Date.now() - new Date(a.createdAt).getTime()) * 0.3
          const bScore = (b.realVotes + b.fakeVotes) * 0.7 + (Date.now() - new Date(b.createdAt).getTime()) * 0.3
          comparison = aScore - bScore
          break
      }

      return sortOrder.value === 'desc' ? -comparison : comparison
    })

    return filtered
  })

  const paginatedNews = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredNews.value.slice(start, end)
  })

  const hasMoreNews = computed(() => {
    return filteredNews.value.length > currentPage.value * pageSize.value
  })

  const newsStats = computed(() => {
    const total = newsList.value.length
    const real = newsList.value.filter(news => news.status === 'real').length
    const fake = newsList.value.filter(news => news.status === 'fake').length
    const pending = newsList.value.filter(news => news.status === 'pending').length

    return {
      total,
      real,
      fake,
      pending,
      realPercentage: total > 0 ? Math.round((real / total) * 100) : 0,
      fakePercentage: total > 0 ? Math.round((fake / total) * 100) : 0
    }
  })

  const featuredNews = computed(() => {
    return newsList.value
      .filter(news => news.status === 'real' && news.realVotes > 20)
      .sort((a, b) => (b.realVotes + b.fakeVotes) - (a.realVotes + a.fakeVotes))[0]
  })

  // Actions
  const fetchAllNews = async () => {
    try {
      loading.value = true
      error.value = null
      const news = await dataService.getAllNews()
      newsList.value = news
      totalCount.value = news.length
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch news'
      console.error('Error fetching news:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchNewsById = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      const news = await dataService.getNewsById(id)
      currentNews.value = news
      return news
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch news'
      console.error('Error fetching news by ID:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchNewsByCategory = async (category: string) => {
    try {
      loading.value = true
      error.value = null
      const news = await dataService.getNewsByCategory(category)
      newsList.value = news
      totalCount.value = news.length
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch news by category'
      console.error('Error fetching news by category:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchNewsByStatus = async (status: 'real' | 'fake' | 'pending') => {
    try {
      loading.value = true
      error.value = null
      const news = await dataService.getNewsByStatus(status)
      newsList.value = news
      totalCount.value = news.length
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch news by status'
      console.error('Error fetching news by status:', err)
    } finally {
      loading.value = false
    }
  }

  const searchNews = async (query: string, filters?: FilterConfig) => {
    try {
      loading.value = true
      error.value = null
      
      // For now, implement simple client-side search
      // In a real app, this would be a server-side search
      let results = newsList.value.filter(news => 
        news.title.toLowerCase().includes(query.toLowerCase()) ||
        news.summary.toLowerCase().includes(query.toLowerCase()) ||
        news.content.toLowerCase().includes(query.toLowerCase())
      )

      if (filters) {
        if (filters.category && filters.category !== 'all') {
          results = results.filter(news => news.category === filters.category)
        }
        if (filters.status && filters.status !== 'all') {
          results = results.filter(news => news.status === filters.status)
        }
        if (filters.dateRange) {
          const now = new Date()
          const filterDate = new Date()
          
          switch (filters.dateRange) {
            case 'today':
              filterDate.setDate(now.getDate() - 1)
              break
            case 'week':
              filterDate.setDate(now.getDate() - 7)
              break
            case 'month':
              filterDate.setMonth(now.getMonth() - 1)
              break
            default:
              filterDate.setFullYear(1970) // All time
          }
          
          results = results.filter(news => new Date(news.createdAt) >= filterDate)
        }
      }

      return results
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search news'
      console.error('Error searching news:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const submitVote = async (voteData: { newsId: string; voteType: 'real' | 'fake' }) => {
    try {
      const fullVoteData = {
        ...voteData,
        createdAt: new Date().toISOString()
      }

      await dataService.submitVote(fullVoteData)
      
      // Update local news data
      const newsIndex = newsList.value.findIndex(news => news.id === voteData.newsId)
      if (newsIndex !== -1) {
        if (voteData.voteType === 'real') {
          newsList.value[newsIndex].realVotes++
        } else {
          newsList.value[newsIndex].fakeVotes++
        }
      }

      // Update current news if it's the same
      if (currentNews.value?.id === voteData.newsId) {
        if (voteData.voteType === 'real') {
          currentNews.value.realVotes++
        } else {
          currentNews.value.fakeVotes++
        }
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to submit vote'
      console.error('Error submitting vote:', err)
      return false
    }
  }

  const submitNews = async (newsData: Partial<News>) => {
    try {
      loading.value = true
      error.value = null
      
      const created = await dataService.submitNews(newsData as any)
      newsList.value.unshift(created)
      totalCount.value++
      return created
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to submit news'
      console.error('Error submitting news:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateNews = async (id: string, newsData: Partial<News>) => {
    try {
      loading.value = true
      error.value = null
      const updated = await dataService.updateNews(id, newsData)
      // Update list
      const idx = newsList.value.findIndex(n => n.id === id)
      if (idx !== -1) {
        newsList.value[idx] = { ...newsList.value[idx], ...updated }
      }
      // Update current news if open
      if (currentNews.value?.id === id) {
        currentNews.value = { ...currentNews.value, ...updated }
      }
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update news'
      console.error('Error updating news:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteNews = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      await dataService.deleteNews(id)
      newsList.value = newsList.value.filter(n => n.id !== id)
      totalCount.value = newsList.value.length
      if (currentNews.value?.id === id) {
        currentNews.value = null
      }
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete news'
      console.error('Error deleting news:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchComments = async (newsId: string) => {
    try {
      const newsComments = await dataService.getCommentsByNewsId(newsId)
      // Update global comments state
      comments.value = newsComments
      return newsComments
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch comments'
      console.error('Error fetching comments:', err)
      throw err // Re-throw to allow caller to handle
    }
  }

  const submitComment = async (commentData: Partial<Comment>) => {
    try {
      // Ensure required fields are present
      if (!commentData.newsId || !commentData.content || !commentData.voteType) {
        throw new Error('Missing required comment fields')
      }

      const newComment: Comment = {
        id: `comment_${Date.now()}`,
        newsId: commentData.newsId,
        content: commentData.content,
        author: commentData.author || 'Anonymous User',
        voteType: commentData.voteType,
        createdAt: new Date().toISOString()
      }

      // Submit to service
      const submittedComment = await dataService.submitComment(newComment)
      
      // Add to local state (at the beginning for newest first)
      comments.value.unshift(submittedComment)

      return submittedComment
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to submit comment'
      console.error('Error submitting comment:', err)
      throw err // Re-throw to allow caller to handle
    }
  }

  // Filter and pagination actions
  const setCategory = (category: string) => {
    activeCategory.value = category
    currentPage.value = 1
  }

  const setStatus = (status: string) => {
    activeStatus.value = status
    currentPage.value = 1
  }

  const setSorting = (sort: 'date' | 'votes' | 'relevance', order: 'asc' | 'desc' = 'desc') => {
    sortBy.value = sort
    sortOrder.value = order
    currentPage.value = 1
  }

  const setPage = (page: number) => {
    currentPage.value = page
  }

  const loadMore = () => {
    currentPage.value++
  }

  const resetFilters = () => {
    activeCategory.value = 'all'
    activeStatus.value = 'all'
    sortBy.value = 'date'
    sortOrder.value = 'desc'
    currentPage.value = 1
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    newsList,
    currentNews,
    comments,
    votes,
    loading,
    error,
    currentPage,
    pageSize,
    totalCount,
    activeCategory,
    activeStatus,
    sortBy,
    sortOrder,

    // Getters
    filteredNews,
    paginatedNews,
    hasMoreNews,
    newsStats,
    featuredNews,

    // Actions
    fetchAllNews,
    fetchNewsById,
    fetchNewsByCategory,
    fetchNewsByStatus,
    searchNews,
    submitVote,
    submitNews,
    updateNews,
    deleteNews,
    fetchComments,
    fetchCommentsByNewsId: fetchComments,
    submitComment,
    setCategory,
    setStatus,
    setSorting,
    setPage,
    loadMore,
    resetFilters,
    clearError
  }
})