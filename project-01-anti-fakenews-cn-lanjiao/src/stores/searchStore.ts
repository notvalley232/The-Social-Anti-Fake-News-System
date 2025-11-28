import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { News, FilterConfig } from '@/types'
import { dataService } from '@/services/dataService'

interface SearchResult {
  news: News[]
  totalCount: number
  query: string
  filters: FilterConfig
  searchTime: number
}

interface SearchSuggestion {
  text: string
  type: 'query' | 'category' | 'tag'
  count?: number
}

interface SearchHistory {
  id: string
  query: string
  filters: FilterConfig
  timestamp: string
  resultCount: number
}

export const useSearchStore = defineStore('search', () => {
  // State
  const currentQuery = ref('')
  const currentFilters = ref<FilterConfig>({
    category: 'all',
    status: 'all',
    dateRange: 'all',
    sortBy: 'relevance'
  })
  const searchResults = ref<News[]>([])
  const totalResults = ref(0)
  const searchTime = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Search suggestions and history
  const suggestions = ref<SearchSuggestion[]>([])
  const searchHistory = ref<SearchHistory[]>([])
  const popularSearches = ref<string[]>([
    'COVID-19 vaccine',
    'Climate change',
    'Technology breakthrough',
    'Political news',
    'Health misinformation',
    'Social media',
    'Artificial intelligence',
    'Economic policy'
  ])

  // Pagination
  const currentPage = ref(1)
  const pageSize = ref(12)
  const hasMoreResults = ref(false)

  // Advanced search options
  const advancedFilters = ref({
    author: '',
    dateFrom: '',
    dateTo: '',
    minVotes: 0,
    maxVotes: 1000,
    includeKeywords: [] as string[],
    excludeKeywords: [] as string[]
  })

  // Getters
  const paginatedResults = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return searchResults.value.slice(start, end)
  })

  const totalPages = computed(() => {
    return Math.ceil(totalResults.value / pageSize.value)
  })

  const hasResults = computed(() => searchResults.value.length > 0)

  const isSearching = computed(() => loading.value)

  const recentSearches = computed(() => {
    return searchHistory.value
      .slice(0, 5)
      .map(history => history.query)
      .filter((query, index, array) => array.indexOf(query) === index)
  })

  const searchSummary = computed(() => {
    if (!hasResults.value) return null
    
    return {
      query: currentQuery.value,
      totalResults: totalResults.value,
      searchTime: searchTime.value,
      currentPage: currentPage.value,
      totalPages: totalPages.value,
      filters: currentFilters.value
    }
  })

  // Actions
  const performSearch = async (query: string, filters?: Partial<FilterConfig>) => {
    try {
      loading.value = true
      error.value = null
      
      const startTime = performance.now()
      
      // Update current search state
      currentQuery.value = query.trim()
      if (filters) {
        currentFilters.value = { ...currentFilters.value, ...filters }
      }
      
      // Reset pagination
      currentPage.value = 1
      
      // Server-side search by title
      const serverResults = await dataService.searchNewsByTitle(currentQuery.value)
      // Apply client-side filters
      const filtered = serverResults.filter(n => {
        const matchCategory = currentFilters.value.category && currentFilters.value.category !== 'all'
          ? n.category?.toLowerCase() === currentFilters.value.category.toLowerCase()
          : true
        const matchStatus = currentFilters.value.status && currentFilters.value.status !== 'all'
          ? n.status?.toLowerCase() === currentFilters.value.status.toLowerCase()
          : true
        return matchCategory && matchStatus
      })

      searchResults.value = filtered
      totalResults.value = filtered.length
      searchTime.value = performance.now() - startTime
      hasMoreResults.value = filtered.length > pageSize.value
      
      // Add to search history
      addToSearchHistory(currentQuery.value, currentFilters.value, filtered.length)
      
      return {
        success: true,
        results: filtered,
        totalCount: filtered.length,
        searchTime: searchTime.value
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Search failed'
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  const loadMoreResults = async () => {
    if (!hasMoreResults.value || loading.value) return
    
    try {
      loading.value = true
      currentPage.value++
      
      // With backend-driven list, recompute hasMore based on totalResults
      hasMoreResults.value = searchResults.value.length < totalResults.value
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load more results'
      currentPage.value-- // Revert page increment on error
    } finally {
      loading.value = false
    }
  }

  const updateFilters = (newFilters: Partial<FilterConfig>) => {
    currentFilters.value = { ...currentFilters.value, ...newFilters }
    
    // Re-search with new filters if there's an active query
    if (currentQuery.value) {
      performSearch(currentQuery.value, currentFilters.value)
    }
  }

  const clearSearch = () => {
    currentQuery.value = ''
    searchResults.value = []
    totalResults.value = 0
    searchTime.value = 0
    currentPage.value = 1
    hasMoreResults.value = false
    error.value = null
    
    // Reset filters to default
    currentFilters.value = {
      category: 'all',
      status: 'all',
      dateRange: 'all',
      sortBy: 'relevance'
    }
  }

  const getSuggestions = async (query: string) => {
    if (query.length < 2) {
      suggestions.value = []
      return []
    }
    
    try {
      // Simulate API call for suggestions
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const mockSuggestions: SearchSuggestion[] = [
        { text: `${query} news`, type: 'query' as const, count: 42 },
        { text: `${query} verification`, type: 'query' as const, count: 28 },
        { text: `${query} fact check`, type: 'query' as const, count: 15 },
        { text: 'technology', type: 'category' as const, count: 156 },
        { text: 'health', type: 'category' as const, count: 89 }
      ].filter(suggestion => 
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      )
      
      suggestions.value = mockSuggestions
      return mockSuggestions
    } catch (err) {
      console.error('Failed to get suggestions:', err)
      return []
    }
  }

  const addToSearchHistory = (query: string, filters: FilterConfig, resultCount: number) => {
    const historyItem: SearchHistory = {
      id: Date.now().toString(),
      query,
      filters: { ...filters },
      timestamp: new Date().toISOString(),
      resultCount
    }
    
    // Remove duplicate queries
    searchHistory.value = searchHistory.value.filter(item => item.query !== query)
    
    // Add to beginning
    searchHistory.value.unshift(historyItem)
    
    // Keep only last 20 searches
    if (searchHistory.value.length > 20) {
      searchHistory.value = searchHistory.value.slice(0, 20)
    }
    
    // Save to localStorage
    saveSearchHistory()
  }

  const removeFromSearchHistory = (id: string) => {
    searchHistory.value = searchHistory.value.filter(item => item.id !== id)
    saveSearchHistory()
  }

  const clearSearchHistory = () => {
    searchHistory.value = []
    localStorage.removeItem('search_history')
  }

  const saveSearchHistory = () => {
    localStorage.setItem('search_history', JSON.stringify(searchHistory.value))
  }

  const loadSearchHistory = () => {
    const stored = localStorage.getItem('search_history')
    if (stored) {
      try {
        searchHistory.value = JSON.parse(stored)
      } catch (err) {
        console.error('Failed to load search history:', err)
      }
    }
  }

  const setAdvancedFilters = (filters: Partial<typeof advancedFilters.value>) => {
    advancedFilters.value = { ...advancedFilters.value, ...filters }
  }

  const clearAdvancedFilters = () => {
    advancedFilters.value = {
      author: '',
      dateFrom: '',
      dateTo: '',
      minVotes: 0,
      maxVotes: 1000,
      includeKeywords: [],
      excludeKeywords: []
    }
  }

  // Mock search function (replace with actual API call)
  // remove mockSearch

  const clearError = () => {
    error.value = null
  }

  // Initialize search history on store creation
  loadSearchHistory()

  return {
    // State
    currentQuery,
    currentFilters,
    searchResults,
    totalResults,
    searchTime,
    loading,
    error,
    suggestions,
    searchHistory,
    popularSearches,
    currentPage,
    pageSize,
    hasMoreResults,
    advancedFilters,

    // Getters
    paginatedResults,
    totalPages,
    hasResults,
    isSearching,
    recentSearches,
    searchSummary,

    // Actions
    performSearch,
    loadMoreResults,
    updateFilters,
    clearSearch,
    getSuggestions,
    addToSearchHistory,
    removeFromSearchHistory,
    clearSearchHistory,
    setAdvancedFilters,
    clearAdvancedFilters,
    clearError
  }
})