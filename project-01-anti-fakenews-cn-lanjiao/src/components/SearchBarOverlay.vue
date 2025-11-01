<template>
  <div class="absolute top-20 left-0 right-0 z-20 px-4">
    <div class="container mx-auto max-w-4xl">
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
        <!-- Search Header -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-white mb-2">Search for News</h2>
          <p class="text-white/80">Find and verify news articles from our database</p>
        </div>

        <!-- Search Input -->
        <div class="relative mb-4">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for news articles, topics, or keywords..."
            class="w-full pl-12 pr-12 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            @keyup.enter="performSearch"
            @input="handleSearchInput"
          />
          <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="text-white/60 hover:text-white transition-colors duration-200"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Search Filters -->
        <div class="flex flex-wrap gap-3 mb-4">
          <button
            v-for="filter in searchFilters"
            :key="filter.value"
            @click="setActiveFilter(filter.value)"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            :class="activeFilter === filter.value 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white/20 text-white hover:bg-white/30'"
          >
            {{ filter.label }}
          </button>
        </div>

        <!-- Quick Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="performSearch"
            :disabled="!searchQuery.trim() || loading"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Searching...' : 'Search News' }}</span>
          </button>
          <button
            @click="showAdvancedSearch = !showAdvancedSearch"
            class="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-colors duration-200"
          >
            Advanced
          </button>
        </div>

        <!-- Advanced Search Options -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div v-if="showAdvancedSearch" class="mt-4 p-4 bg-white/10 rounded-xl border border-white/20">
            <h3 class="text-white font-semibold mb-3">Advanced Search Options</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-white/80 text-sm mb-2">Date Range</label>
                <select
                  v-model="dateRange"
                  class="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div>
                <label class="block text-white/80 text-sm mb-2">Sort By</label>
                <select
                  v-model="sortBy"
                  class="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                  <option value="votes">Vote Count</option>
                </select>
              </div>
            </div>
          </div>
        </transition>

        <!-- Search Suggestions -->
        <div v-if="searchSuggestions.length > 0" class="mt-4">
          <h3 class="text-white/80 text-sm mb-2">Popular Searches</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="suggestion in searchSuggestions"
              :key="suggestion"
              @click="searchQuery = suggestion; performSearch()"
              class="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-lg transition-colors duration-200"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')
const activeFilter = ref('all')
const loading = ref(false)
const showAdvancedSearch = ref(false)
const dateRange = ref('all')
const sortBy = ref('relevance')

const searchFilters = [
  { label: 'All News', value: 'all' },
  { label: 'Real News', value: 'real' },
  { label: 'Fake News', value: 'fake' },
  { label: 'Under Review', value: 'pending' }
]

const searchSuggestions = ref([
  'COVID-19 vaccine',
  'Climate change',
  'Technology breakthrough',
  'Political news',
  'Health misinformation'
])

const emit = defineEmits<{
  search: [query: string, filters: any]
}>()

const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  loading.value = true
  
  try {
    const searchParams = {
      query: searchQuery.value,
      filter: activeFilter.value,
      dateRange: dateRange.value,
      sortBy: sortBy.value
    }

    // Emit search event to parent component
    emit('search', searchQuery.value, searchParams)

    // Navigate to search results page
    await router.push({
      path: '/search',
      query: {
        q: searchQuery.value,
        filter: activeFilter.value,
        date: dateRange.value,
        sort: sortBy.value
      }
    })
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const setActiveFilter = (filter: string) => {
  activeFilter.value = filter
}

const handleSearchInput = () => {
  // Debounced search suggestions could be implemented here
  // For now, we'll just update the search query
}

// Watch for search query changes to provide real-time suggestions
watch(searchQuery, (newQuery) => {
  if (newQuery.length > 2) {
    // Here you could implement real-time search suggestions
    // For now, we'll just show static suggestions
  }
})
</script>

<style scoped>
/* Custom select styling for better appearance */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Custom scrollbar for suggestions */
.suggestions-container::-webkit-scrollbar {
  width: 4px;
}

.suggestions-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.suggestions-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

/* Input focus effects */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Button hover effects */
button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* Backdrop blur fallback */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>