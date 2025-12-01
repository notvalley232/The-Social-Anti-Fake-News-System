<template>
  <div class="min-h-screen bg-background-secondary">
    <!-- Navigation -->
    <NavigationOverlay />
    
    <!-- Search Header -->
    <header class="pt-20 pb-8 bg-white border-b border-border">
      <div class="container-responsive">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold text-text-primary mb-6">Search News</h1>
          
          <!-- Search Form -->
          <div class="space-y-4">
            <div class="relative">
              <input
                v-model="searchQuery"
                @keyup.enter="performSearch"
                type="text"
                placeholder="Search for news, topics, or keywords..."
                class="input w-full pl-12 pr-4 h-12 text-lg"
              />
              <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <button
                @click="performSearch"
                :disabled="!searchQuery.trim()"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary btn-sm"
              >
                Search
              </button>
            </div>
            
            <!-- Filters -->
            <div class="flex flex-wrap gap-3">
              <select v-model="filters.category" class="input w-auto">
                <option value="all">All Categories</option>
                <option value="technology">Technology</option>
                <option value="health">Health</option>
                <option value="politics">Politics</option>
                <option value="science">Science</option>
                <option value="entertainment">Entertainment</option>
              </select>
              
              <select v-model="filters.status" class="input w-auto">
                <option value="all">All Status</option>
                <option value="real">Verified Real</option>
                <option value="fake">Verified Fake</option>
                <option value="pending">Under Review</option>
              </select>
              
              <select v-model="filters.sortBy" class="input w-auto">
                <option value="relevance">Relevance</option>
                <option value="date">Latest</option>
                <option value="votes">Most Voted</option>
              </select>
              
              <button
                @click="clearFilters"
                class="btn btn-ghost btn-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Search Results -->
    <main class="py-8">
      <div class="container-responsive">
        <div class="max-w-4xl mx-auto">
          <!-- Search Summary -->
          <div v-if="searchSummary" class="mb-6 p-4 bg-white rounded-lg shadow-soft">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-text-primary">
                  Search Results for "{{ searchSummary.query }}"
                </h2>
                <p class="text-text-secondary">
                  {{ searchSummary.totalResults }} results found in {{ searchSummary.searchTime.toFixed(0) }}ms
                </p>
              </div>
              <div class="text-sm text-text-secondary">
                Page {{ searchSummary.currentPage }} of {{ searchSummary.totalPages }}
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isSearching" class="flex justify-center items-center py-12">
            <div class="spinner w-8 h-8"></div>
            <span class="ml-3 text-text-secondary">Searching...</span>
          </div>

          <!-- No Results -->
          <div v-else-if="!hasResults && searchQuery" class="text-center py-12">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-semibold text-text-primary mb-2">No results found</h3>
            <p class="text-text-secondary mb-6">
              Try adjusting your search terms or filters
            </p>
            <div class="space-y-2">
              <p class="text-sm text-text-secondary">Suggestions:</p>
              <ul class="text-sm text-text-secondary space-y-1">
                <li>• Check your spelling</li>
                <li>• Try more general keywords</li>
                <li>• Remove some filters</li>
              </ul>
            </div>
          </div>

          <!-- Search Results Grid -->
          <div v-else-if="hasResults" class="space-y-6">
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <NewsCard
                v-for="news in paginatedResults"
                :key="news.id"
                :news="news"
                @click="$router.push(`/news/${news.id}`)"
              />
            </div>

            <!-- Load More Button -->
            <div v-if="hasMoreResults" class="text-center">
              <button
                @click="loadMoreResults"
                :disabled="isSearching"
                class="btn btn-primary btn-lg"
              >
                <span v-if="isSearching">Loading...</span>
                <span v-else>Load More Results</span>
              </button>
            </div>

            <!-- Pagination Info -->
            <div class="text-center text-sm text-text-secondary">
              Showing {{ paginatedResults.length }} of {{ totalResults }} results
            </div>
          </div>

          <!-- Popular Searches -->
          <div v-else class="space-y-8">
            <div class="bg-white rounded-xl shadow-soft p-6">
              <h3 class="text-lg font-semibold text-text-primary mb-4">Popular Searches</h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="search in popularSearches"
                  :key="search"
                  @click="searchQuery = search; performSearch()"
                  class="btn btn-ghost btn-sm"
                >
                  {{ search }}
                </button>
              </div>
            </div>

            <div v-if="recentSearches.length > 0" class="bg-white rounded-xl shadow-soft p-6">
              <h3 class="text-lg font-semibold text-text-primary mb-4">Recent Searches</h3>
              <div class="space-y-2">
                <button
                  v-for="search in recentSearches"
                  :key="search"
                  @click="searchQuery = search; performSearch()"
                  class="block w-full text-left p-2 hover:bg-background-secondary rounded-lg transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <Clock class="w-4 h-4 text-text-muted" />
                    <span class="text-text-primary">{{ search }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Clock } from 'lucide-vue-next'
import NavigationOverlay from '@/components/NavigationOverlay.vue'
import NewsCard from '@/components/NewsCard.vue'
import { useSearchStore } from '@/stores/searchStore'
import type { FilterConfig } from '@/types'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

// State
const searchQuery = ref('')
const filters = ref<FilterConfig>({
  category: 'all',
  status: 'all',
  dateRange: 'all',
  sortBy: 'relevance'
})

// Computed
const {
  paginatedResults,
  totalResults,
  hasResults,
  isSearching,
  hasMoreResults,
  searchSummary,
  popularSearches,
  recentSearches
} = searchStore

// Methods
const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  await searchStore.performSearch(searchQuery.value, filters.value)
  
  // Update URL with search params
  router.push({
    query: {
      q: searchQuery.value,
      ...filters.value
    }
  })
}

const loadMoreResults = async () => {
  await searchStore.loadMoreResults()
}

const clearFilters = () => {
  filters.value = {
    category: 'all',
    status: 'all',
    dateRange: 'all',
    sortBy: 'relevance'
  }
  
  if (searchQuery.value) {
    performSearch()
  }
}

// Watch for filter changes
watch(filters, () => {
  if (searchQuery.value) {
    performSearch()
  }
}, { deep: true })

// Initialize from URL params
onMounted(() => {
  const query = route.query.q as string
  if (query) {
    searchQuery.value = query
    
    // Apply filters from URL
    if (route.query.category) filters.value.category = route.query.category as string
    if (route.query.status) filters.value.status = route.query.status as string
    if (route.query.sortBy) filters.value.sortBy = route.query.sortBy as string
    
    performSearch()
  }
})
</script>