<template>
  <div class="min-h-screen bg-background-primary">
    <!-- Navigation -->
    <NavigationOverlay />
    
    <!-- Hero Section with Video Background -->
    <section class="relative h-screen flex items-center justify-center">
      <VideoBackground>
        <div class="container-responsive relative z-10 text-center text-white pt-24">
          <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Fight Fake News
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-white text-opacity-90 max-w-3xl mx-auto animate-slide-up">
            Community-driven fact-checking platform where truth matters. 
            Submit, verify, and vote on news authenticity together.
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto mb-8 animate-slide-up" style="animation-delay: 0.2s;">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search for news to verify..."
                class="w-full px-6 py-4 text-lg rounded-full bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                @keyup.enter="performSearch"
              />
              <button
                @click="performSearch"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full transition-colors"
              >
                <Search class="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-4 justify-center animate-slide-up" style="animation-delay: 0.4s;">
            <button @click="$router.push('/submit')" class="btn btn-primary btn-lg">
              Submit News
            </button>
            <button @click="$router.push('/about')" class="btn btn-secondary btn-lg">
              Learn More
            </button>
          </div>
        </div>
      </VideoBackground>
    </section>
 
     <!-- Main Content Section -->
    <main class="relative z-10 bg-white">
      <section class="py-8 bg-white border-b border-gray-200" v-if="isAuthenticated && currentUser">
        <div class="container mx-auto px-4">
          <div class="flex items-center gap-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              <img v-if="currentUser.avatar" :src="currentUser.avatar" class="w-full h-full object-cover" />
            </div>
            <div>
              <div class="text-xl font-bold text-gray-900">{{ currentUser.username || currentUser.email }}</div>
              <div class="text-gray-600">Role: {{ currentUser.role }}</div>
            </div>
          </div>
        </div>
      </section>
      <!-- News Categories Section -->
      <section id="latest-news-section" class="py-8 bg-white border-b border-gray-200">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Latest News</h2>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="category in newsCategories"
                :key="category.value"
                @click="setActiveCategory(category.value)"
                class="group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                :class="activeCategory === category.value 
                  ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'"
              >
                <span class="relative z-10">{{ category.label }}</span>
                <span 
                  v-if="getCategoryCount(category.value) > 0"
                  class="ml-2 px-2 py-0.5 text-xs rounded-full transition-colors duration-300"
                  :class="activeCategory === category.value 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600 group-hover:bg-blue-200 group-hover:text-blue-800'"
                >
                  {{ getCategoryCount(category.value) }}
                </span>
                <!-- Active indicator -->
                <div 
                  v-if="activeCategory === category.value"
                  class="absolute inset-0 bg-blue-600 rounded-lg opacity-10 animate-pulse"
                ></div>
              </button>
            </div>
          </div>

          <!-- Category Description -->
          <p class="text-gray-600 mb-6">
            {{ getCategoryDescription(activeCategory) }}
          </p>

          <!-- Fake/Real Filter Section -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-800">News Authenticity</h3>
              <div class="text-sm text-gray-600">
                <span v-if="activeAuthenticityFilter === null" class="text-blue-600 font-medium">
                  📰 Showing all news
                </span>
                <span v-else-if="activeAuthenticityFilter === 'real'" class="text-green-600 font-medium">
                  ✅ Showing verified real news
                </span>
                <span v-else-if="activeAuthenticityFilter === 'fake'" class="text-red-600 font-medium">
                  ❌ Showing verified fake news
                </span>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="filter in authenticityFilters"
                :key="filter.value"
                @click="setAuthenticityFilter(filter.value)"
                class="group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 border-2"
                :class="activeAuthenticityFilter === filter.value 
                  ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-300 border-green-600' 
                  : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-md border-gray-200 hover:border-green-300'"
              >
                <span class="relative z-10 flex items-center">
                  <span class="mr-2">{{ filter.icon }}</span>
                  {{ filter.label }}
                </span>
                <span 
                  v-if="getAuthenticityCount(filter.value) > 0"
                  class="ml-2 px-2 py-0.5 text-xs rounded-full transition-colors duration-300"
                  :class="activeAuthenticityFilter === filter.value 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600 group-hover:bg-green-200 group-hover:text-green-800'"
                >
                  {{ getAuthenticityCount(filter.value) }}
                </span>
                <!-- Active indicator -->
                <div 
                  v-if="activeAuthenticityFilter === filter.value"
                  class="absolute inset-0 bg-green-600 rounded-lg opacity-10 animate-pulse"
                ></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- News Grid Section -->
      <section class="py-12">
        <div class="container mx-auto px-4">
          <!-- Pagination Controls -->
          <div class="flex items-center justify-between mb-8">
            <!-- Items per page selector -->
            <div class="flex items-center space-x-4">
              <span class="text-sm font-medium text-gray-700">Items per page:</span>
              <select 
                v-model="itemsPerPage" 
                @change="onItemsPerPageChange"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="6">6 news</option>
                <option value="9">9 news</option>
                <option value="12">12 news</option>
                <option value="15">15 news</option>
                <option value="30">30 news</option>
              </select>
            </div>

            <!-- Page navigation -->
            <div class="flex items-center space-x-2">
              <button
                @click="goToPreviousPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              
              <span class="px-3 py-2 text-sm text-gray-700">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              
              <button
                @click="goToNextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <div class="text-gray-600 text-lg font-medium">Loading news...</div>
            <div class="text-gray-400 text-sm mt-2">Please wait while we fetch the latest news</div>
          </div>

          <!-- Empty State -->
          <div v-else-if="paginatedNews.length === 0" class="flex flex-col items-center justify-center py-16">
            <div class="text-gray-400 text-6xl mb-4">{{ getEmptyStateIcon(activeCategory) }}</div>
            <div class="text-gray-600 text-xl font-medium mb-2">{{ getEmptyStateTitle(activeCategory) }}</div>
            <div class="text-gray-400 text-sm text-center max-w-md mb-6">
              {{ getEmptyStateMessage(activeCategory) }}
            </div>
            <div class="flex gap-3">
              <button 
                @click="setActiveCategory('all')"
                class="btn btn-primary btn-sm"
                v-if="activeCategory !== 'all'"
              >
                View All News
              </button>
              <button 
                @click="$router.push('/submit')"
                class="btn btn-secondary btn-sm"
              >
                Submit News
              </button>
            </div>
          </div>

          <!-- News Grid with Featured Story -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <NewsCard
              v-for="news in paginatedNews"
              :key="news.id"
              :news="news"
              :is-featured="news.id === featuredNews?.id"
              @click="navigateToNews(news.id)"
              @vote="handleVote"
              class="border border-gray-200 hover:border-gray-300 transition-colors duration-200"
            />
          </div>




        </div>
      </section>

      <!-- Statistics Section -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h3 class="text-3xl font-bold text-gray-900 mb-4">Platform Statistics</h3>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Our community-driven platform helps identify and combat misinformation through collective verification.
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="bg-white rounded-2xl p-8 shadow-lg">
                <div class="text-4xl font-bold text-blue-600 mb-2">{{ stats.totalNews }}</div>
                <div class="text-gray-600">Total News Articles</div>
              </div>
            </div>
            <div class="text-center">
              <div class="bg-white rounded-2xl p-8 shadow-lg">
                <div class="text-4xl font-bold text-green-600 mb-2">{{ stats.verifiedReal }}</div>
                <div class="text-gray-600">Verified Real</div>
              </div>
            </div>
            <div class="text-center">
              <div class="bg-white rounded-2xl p-8 shadow-lg">
                <div class="text-4xl font-bold text-red-600 mb-2">{{ stats.verifiedFake }}</div>
                <div class="text-gray-600">Verified Fake</div>
              </div>
            </div>
            <div class="text-center">
              <div class="bg-white rounded-2xl p-8 shadow-lg">
                <div class="text-4xl font-bold text-yellow-600 mb-2">{{ stats.underReview }}</div>
                <div class="text-gray-600">Under Review</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">Anti-Fake News</h2>
          <p class="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Fighting misinformation through community-driven verification and fact-checking.
          </p>
          <p class="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Our platform empowers users to submit news for verification, participate in collaborative fact-checking, 
            and access reliable information to combat the spread of false narratives in today's digital landscape.
          </p>
        </div>
        <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Anti-Fake News System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { TrendingUp, Users, Shield, Clock, Search } from 'lucide-vue-next'
import NavigationOverlay from '@/components/NavigationOverlay.vue'
import VideoBackground from '@/components/VideoBackground.vue'
import NewsCard from '@/components/NewsCard.vue'
import { useNewsStore } from '@/stores/newsStore'
import { useUserStore } from '@/stores/userStore'
import type { News } from '@/types'

const router = useRouter()
const newsStore = useNewsStore()
const userStore = useUserStore()

// Reactive data
const newsList = ref<News[]>([])
const activeCategory = ref('all')
const activeAuthenticityFilter = ref(null)
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(6)
const searchQuery = ref('')

// News categories - updated to match actual data
const newsCategories = [
  { label: 'All News', value: 'all' },
  { label: 'Technology', value: 'Technology' },
  { label: 'Health', value: 'Health' },
  { label: 'Science', value: 'Science' },
  { label: 'Environment', value: 'Environment' }, // Updated from Economics
  { label: 'Finance', value: 'Finance' } // Updated from History
]

// Authenticity filters
const authenticityFilters = [
  { label: 'Verified Real', value: 'real', icon: '✅' },
  { label: 'Verified Fake', value: 'fake', icon: '❌' }
]

// Computed properties
const featuredNews = computed(() => {
  return newsList.value.find(news => news.status === 'real' && news.realVotes > 50)
})

const filteredNews = computed(() => {
  let filtered = newsList.value
  
  // Filter by category with case-insensitive matching
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(news => {
      if (!news.category) return false
      return news.category.toLowerCase() === activeCategory.value.toLowerCase()
    })
  }
  
  // Filter by authenticity (Fake/Real)
  if (activeAuthenticityFilter.value !== null) {
    filtered = filtered.filter(news => {
      if (activeAuthenticityFilter.value === 'real') {
        return news.status === 'real'
      } else if (activeAuthenticityFilter.value === 'fake') {
        return news.status === 'fake'
      }
      return true
    })
  }
  
  // Sort by date (newest first) for better user experience
  filtered = filtered.sort((a, b) => {
    const dateA = new Date(a.submittedAt || a.createdAt || '').getTime()
    const dateB = new Date(b.submittedAt || b.createdAt || '').getTime()
    return dateB - dateA
  })
  
  return filtered
})

const totalPages = computed(() => {
  const pageSize = Number(itemsPerPage.value)
  return Math.ceil(filteredNews.value.length / pageSize)
})

const paginatedNews = computed(() => {
  const pageSize = Number(itemsPerPage.value)
  const page = Number(currentPage.value)
  
  // Boundary checks
  if (pageSize <= 0 || page <= 0) {
    console.warn('Invalid pagination parameters:', { pageSize, page })
    return []
  }
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const result = filteredNews.value.slice(start, end)
  
  // Debug logging for troubleshooting
  console.log('Pagination Debug:', {
    totalNews: filteredNews.value.length,
    pageSize,
    page,
    start,
    end,
    resultCount: result.length
  })
  
  return result
})

const stats = computed(() => {
  const total = newsList.value.length
  const real = newsList.value.filter(news => news.status === 'real').length
  const fake = newsList.value.filter(news => news.status === 'fake').length
  const pending = newsList.value.filter(news => news.status === 'pending').length
  
  return {
    totalNews: total,
    verifiedReal: real,
    verifiedFake: fake,
    underReview: pending
  }
})

const isAuthenticated = computed(() => userStore.isAuthenticated)
const currentUser = computed(() => userStore.currentUser)

// Methods
const loadNews = async () => {
  try {
    loading.value = true
    // Use newsStore to load data for consistency
    await newsStore.fetchAllNews()
    newsList.value = newsStore.newsList
  } catch (error) {
    console.error('Failed to load news:', error)
  } finally {
    loading.value = false
  }
}

const setActiveCategory = (category: string) => {
  activeCategory.value = category
  currentPage.value = 1
  // Save to localStorage for persistence
  localStorage.setItem('activeCategory', category)
}

const setAuthenticityFilter = (filter: string) => {
  // Toggle filter: if clicking the same filter, deselect it
  if (activeAuthenticityFilter.value === filter) {
    activeAuthenticityFilter.value = null
    localStorage.removeItem('activeAuthenticityFilter')
  } else {
    activeAuthenticityFilter.value = filter
    localStorage.setItem('activeAuthenticityFilter', filter)
  }
  currentPage.value = 1
}

const onItemsPerPageChange = () => {
  // Ensure itemsPerPage is always a number
  itemsPerPage.value = Number(itemsPerPage.value)
  currentPage.value = 1
  
  // Validate that itemsPerPage is within reasonable bounds
  if (itemsPerPage.value < 1) {
    itemsPerPage.value = 6
  }
  if (itemsPerPage.value > 50) {
    itemsPerPage.value = 30
  }
}

const goToPreviousPage = () => {
  const page = Number(currentPage.value)
  if (page > 1) {
    currentPage.value = page - 1
  }
}

const goToNextPage = () => {
  const page = Number(currentPage.value)
  const maxPages = Number(totalPages.value)
  if (page < maxPages) {
    currentPage.value = page + 1
  }
}



const getCategoryDescription = (category: string) => {
  const descriptions = {
    all: 'All verified and pending news articles from various categories.',
    Technology: 'Latest developments in technology, innovation, and digital transformation.',
    Health: 'Medical breakthroughs, health policies, and wellness-related news.',
    Science: 'Scientific discoveries, research findings, and academic developments.',
    Environment: 'Environmental protection, climate change, and sustainability news.',
    Finance: 'Financial markets, investment trends, and economic analysis.'
  }
  return descriptions[category as keyof typeof descriptions] || descriptions.all
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    real: 'bg-green-100 text-green-800',
    fake: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status as keyof typeof classes] || classes.pending
}

const getStatusLabel = (status: string) => {
  const labels = {
    real: 'Verified Real',
    fake: 'Verified Fake',
    pending: 'Under Review'
  }
  return labels[status as keyof typeof labels] || 'Unknown'
}



const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { q: searchQuery.value.trim() }
    })
  }
}

const navigateToNews = (newsId: string) => {
  router.push(`/news/${newsId}`)
}

const handleSearch = (query: string, filters: any) => {
  console.log('Search triggered:', query, filters)
  // Search functionality will be implemented in search page
}

const handleVote = (newsId: string, voteType: 'real' | 'fake') => {
  console.log('Vote triggered:', newsId, voteType)
  // Vote functionality will be implemented with Pinia store
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getFeaturedConfidencePercentage = () => {
  if (!featuredNews.value) return 0
  const total = featuredNews.value.realVotes + featuredNews.value.fakeVotes
  if (total === 0) return 0
  return Math.round((featuredNews.value.realVotes / total) * 100)
}

const getFeaturedConfidenceBarClass = () => {
  const percentage = getFeaturedConfidencePercentage()
  if (percentage >= 70) return 'bg-green-500'
  if (percentage >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getEmptyStateIcon = (category: string) => {
  const icons = {
    all: '📰',
    Technology: '💻',
    Health: '🏥',
    Science: '🔬',
    Environment: '🌱',
    Finance: '💰'
  }
  return icons[category as keyof typeof icons] || '📰'
}

const getEmptyStateTitle = (category: string) => {
  const titles = {
    all: 'No News Available',
    Technology: 'No Technology News',
    Health: 'No Health News',
    Science: 'No Science News',
    Environment: 'No Environment News',
    Finance: 'No Finance News'
  }
  return titles[category as keyof typeof titles] || titles.all
}

const getEmptyStateMessage = (category: string) => {
  const messages = {
    all: 'There are currently no news articles available. Check back later or submit your own news for verification.',
    Technology: 'No technology news articles are currently available in this category. Try viewing all news or submit technology-related news.',
    Health: 'No health news articles are currently available in this category. Try viewing all news or submit health-related news.',
    Science: 'No science news articles are currently available in this category. Try viewing all news or submit science-related news.',
    Environment: 'No environment news articles are currently available in this category. Try viewing all news or submit environment-related news.',
    Finance: 'No finance news articles are currently available in this category. Try viewing all news or submit finance-related news.'
  }
  return messages[category as keyof typeof messages] || messages.all
}

const getCategoryCount = (category: string) => {
  if (category === 'all') {
    return newsList.value.length
  }
  
  return newsList.value.filter(news => {
    if (!news.category) return false
    return news.category.toLowerCase() === category.toLowerCase()
  }).length
}

const getAuthenticityCount = (filter: string) => {
  let filtered = newsList.value
  
  // Apply category filter first if not 'all'
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(news => {
      if (!news.category) return false
      return news.category.toLowerCase() === activeCategory.value.toLowerCase()
    })
  }
  
  // Apply authenticity filter
  if (filter === 'real') {
    return filtered.filter(news => news.status === 'real').length
  } else if (filter === 'fake') {
    return filtered.filter(news => news.status === 'fake').length
  }
  
  return 0
}

// Watchers
watch(totalPages, (newTotalPages) => {
  // Auto-correct currentPage if it exceeds totalPages
  const maxPages = Number(newTotalPages)
  const page = Number(currentPage.value)
  
  if (page > maxPages && maxPages > 0) {
    currentPage.value = maxPages
    console.log('Auto-corrected currentPage to:', maxPages)
  }
})

// Lifecycle
onMounted(() => {
  // Restore saved filter states from localStorage
  const savedCategory = localStorage.getItem('activeCategory')
  const savedAuthenticityFilter = localStorage.getItem('activeAuthenticityFilter')
  
  if (savedCategory) {
    activeCategory.value = savedCategory
  }
  
  if (savedAuthenticityFilter && savedAuthenticityFilter !== 'all') {
    activeAuthenticityFilter.value = savedAuthenticityFilter
  }
  
  loadNews()
})
</script>

<style scoped>
/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Hover effects */
.hover-lift:hover {
  transform: translateY(-4px);
  transition: transform 0.3s ease;
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

/* Responsive video container */
.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
