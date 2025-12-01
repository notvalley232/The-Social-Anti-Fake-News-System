<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <NavigationOverlay />
    
    <!-- Breadcrumb and Back Button -->
    <div class="bg-white border-b border-gray-200 pt-16 md:pt-20">
      <div class="container mx-auto px-4 md:px-6 py-3 md:py-4 max-w-7xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 md:space-x-4">
            <button 
              @click="goBack"
              class="flex items-center space-x-1 md:space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft class="w-4 h-4 md:w-5 md:h-5" />
              <span class="font-medium text-sm md:text-base">Back</span>
            </button>
            <div class="text-gray-400 hidden sm:block">•</div>
            <nav class="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <router-link to="/" class="hover:text-gray-700">Home</router-link>
              <ChevronRight class="w-4 h-4" />
              <span class="text-gray-900">News Detail</span>
            </nav>
          </div>
          <div class="flex items-center space-x-2 md:space-x-3">
            <button 
              @click="shareNews"
              class="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <Share2 class="w-4 h-4" />
              <span class="hidden md:inline text-sm">Share</span>
            </button>
            <button 
              @click="bookmarkNews"
              class="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <Bookmark class="w-4 h-4" />
              <span class="hidden md:inline text-sm">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
     <main class="py-6 md:py-8">
       <div class="container mx-auto px-4 md:px-6 max-w-7xl">
         <div class="max-w-4xl mx-auto">
          <!-- Loading State -->
          <div v-if="loading" class="bg-white rounded-xl shadow-sm p-6 md:p-8 lg:p-12">
            <div class="flex flex-col items-center justify-center space-y-4">
              <div class="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600"></div>
              <div class="text-gray-600 text-sm md:text-base lg:text-lg">Loading news details...</div>
              <div class="text-gray-400 text-xs md:text-sm text-center">Please wait while we fetch the latest information</div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-white rounded-xl shadow-sm p-6 md:p-8 lg:p-12">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 rounded-full bg-red-100 mb-4 md:mb-6">
                <AlertCircle class="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-red-600" />
              </div>
              <h3 class="text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-2">Unable to Load News</h3>
              <p class="text-gray-600 mb-6 text-xs md:text-sm lg:text-base">{{ error }}</p>
              <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  @click="loadNewsDetail" 
                  class="px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-xs md:text-sm lg:text-base"
                >
                  <RefreshCw class="w-3 h-3 md:w-4 md:h-4" />
                  <span>Try Again</span>
                </button>
                <button 
                  @click="goBack" 
                  class="px-4 md:px-6 py-2 md:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-xs md:text-sm lg:text-base"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>

          <!-- News Detail Content -->
          <article v-else-if="news" class="space-y-4 md:space-y-8">
            <!-- Hero Image -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="relative group h-64 md:h-80 lg:h-96">
                <img 
                  :src="news.imageUrl" 
                  :alt="news.title"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  @error="handleImageError"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div class="absolute top-3 md:top-6 left-3 md:left-6">
                  <span :class="getStatusBadgeClass(news.status)" class="px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold backdrop-blur-sm">
                    {{ getStatusText(news.status) }}
                  </span>
                </div>
                <div class="absolute top-3 md:top-6 right-3 md:right-6">
                  <span class="px-2 md:px-4 py-1 md:py-2 bg-black/30 text-white text-xs md:text-sm font-medium rounded-full backdrop-blur-sm">
                    {{ news.category }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Article Header -->
            <div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <header class="border-b border-gray-200 pb-4 md:pb-6 mb-4 md:mb-6">
                <div class="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 mb-4">
                  <div class="flex items-center space-x-1 md:space-x-2">
                    <Calendar class="w-3 h-3 md:w-4 md:h-4" />
                    <time class="text-xs md:text-sm">{{ formatDate(news.createdAt) }}</time>
                  </div>
                  <div class="flex items-center space-x-1 md:space-x-2">
                    <User class="w-3 h-3 md:w-4 md:h-4" />
                    <span class="text-xs md:text-sm">{{ news.reporter }}</span>
                  </div>
                  <div class="flex items-center space-x-1 md:space-x-2">
                    <Eye class="w-3 h-3 md:w-4 md:h-4" />
                    <span class="text-xs md:text-sm">{{ news.views || 0 }} views</span>
                  </div>
                  <div v-if="news.sourceUrl" class="flex items-center space-x-1 md:space-x-2">
                    <ExternalLink class="w-3 h-3 md:w-4 md:h-4" />
                    <a :href="news.sourceUrl" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline text-xs md:text-sm">
                      Original Source
                    </a>
                  </div>
                </div>
                
                <h1 class="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                  {{ news.title }}
                </h1>
                
                <p class="text-base md:text-lg text-gray-600 leading-relaxed">
                  {{ news.summary }}
                </p>
              </header>

              <!-- Article Content -->
              <div class="prose prose-sm md:prose-base lg:prose-lg max-w-none">
                <div class="text-gray-800 leading-relaxed text-sm md:text-base lg:text-lg whitespace-pre-line">
                  {{ news.content }}
                </div>
              </div>
            </div>

            <!-- Voting Section -->
            <div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <div class="text-center mb-6 md:mb-8">
                <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">Community Verification</h3>
                <p class="text-gray-600 text-sm md:text-base">Help verify the authenticity of this news article</p>
              </div>

              <!-- Confidence Meter -->
              <div class="mb-6 md:mb-8">
                <div class="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-2">
                  <span>Community Confidence</span>
                  <span class="font-semibold">{{ confidenceScore }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 md:h-3">
                  <div
                    class="h-2 md:h-3 rounded-full transition-all duration-500 ease-out"
                    :class="getConfidenceBarClass()"
                    :style="{ width: `${confidenceScore}%` }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Likely Fake</span>
                  <span class="hidden sm:inline">Uncertain</span>
                  <span>Likely Real</span>
                </div>
              </div>

              <!-- Vote Statistics -->
              <div class="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
                <div class="text-center p-3 md:p-4 bg-green-50 rounded-lg">
                  <div class="text-xl md:text-3xl font-bold text-green-600 mb-1">{{ news.realVotes }}</div>
                  <div class="text-xs md:text-sm text-green-700 font-medium">Real Votes</div>
                </div>
                <div class="text-center p-3 md:p-4 bg-red-50 rounded-lg">
                  <div class="text-xl md:text-3xl font-bold text-red-600 mb-1">{{ news.fakeVotes }}</div>
                  <div class="text-xs md:text-sm text-red-700 font-medium">Fake Votes</div>
                </div>
                <div class="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
                  <div class="text-xl md:text-3xl font-bold text-blue-600 mb-1">{{ totalVotes }}</div>
                  <div class="text-xs md:text-sm text-blue-700 font-medium">Total Votes</div>
                </div>
              </div>
                
              <!-- Voting Buttons -->
              <div class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <button 
                  @click="vote('real')"
                  :disabled="hasVoted"
                  class="flex items-center justify-center space-x-2 md:space-x-3 px-4 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm md:text-base"
                  :class="userVote === 'real' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300'"
                >
                  <CheckCircle class="w-4 h-4 md:w-5 md:h-5" />
                  <span>{{ userVote === 'real' ? 'Voted Real' : 'Vote Real' }}</span>
                </button>
                <button 
                    @click="vote('fake')"
                    :disabled="hasVoted"
                    class="flex items-center justify-center space-x-2 md:space-x-3 px-4 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm md:text-base"
                    :class="userVote === 'fake' 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-300'"
                    >
                      <XCircle class="w-4 h-4 md:w-5 md:h-5" />
                      <span>{{ userVote === 'fake' ? 'Voted Fake' : 'Vote Fake' }}</span>
                    </button>
                  </div>
                </div>
          </article>

          <!-- Comments Section -->
          <section v-if="news" class="mt-4 md:mt-8">
            <div class="bg-white rounded-xl shadow-sm p-4 md:p-8">
              <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                Community Discussion ({{ comments.length }})
              </h2>
              
              <!-- Comment Form -->
              <div class="mb-6 md:mb-8 p-4 md:p-6 bg-gray-50 rounded-lg">
                <textarea 
                  v-model="newComment"
                  placeholder="Share your thoughts about this news article..."
                  class="w-full p-3 md:p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                  rows="3"
                ></textarea>
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
                  <div class="flex gap-2 md:gap-3 w-full sm:w-auto">
                    <button 
                      @click="commentVoteType = 'real'"
                      :class="commentVoteType === 'real' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'"
                      class="px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm md:text-base flex-1 sm:flex-none"
                    >
                      Real News
                    </button>
                    <button 
                      @click="commentVoteType = 'fake'"
                      :class="commentVoteType === 'fake' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'"
                      class="px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm md:text-base flex-1 sm:flex-none"
                    >
                      Fake News
                    </button>
                  </div>
                  <button 
                    @click="submitComment"
                    :disabled="!newComment.trim() || !commentVoteType || submittingComment"
                    class="px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm md:text-base w-full sm:w-auto flex items-center justify-center space-x-2"
                  >
                    <div v-if="submittingComment" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{{ submittingComment ? 'Posting...' : 'Post Comment' }}</span>
                  </button>
                </div>
              </div>

              <!-- Comments List -->
              <div class="space-y-4 md:space-y-6">
                <div 
                  v-for="comment in comments" 
                  :key="comment.id"
                  class="p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div class="flex items-start justify-between mb-3 md:mb-4">
                    <div class="flex items-center gap-2 md:gap-3">
                      <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
                        {{ comment.author.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <div class="font-semibold text-gray-900 text-sm md:text-base">{{ comment.author }}</div>
                        <div class="text-xs md:text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</div>
                      </div>
                    </div>
                    <span
                      :class="comment.voteType === 'real' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'"
                      class="px-2 md:px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {{ comment.voteType === 'real' ? 'Real News' : 'Fake News' }}
                    </span>
                  </div>
                  <p class="text-gray-700 leading-relaxed text-sm md:text-base">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- Notification Toast -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2"
    >
      <div
        v-if="notification.show"
        class="fixed top-4 right-4 z-50 max-w-xs md:max-w-sm w-full mx-4 md:mx-0"
      >
        <div
          :class="{
            'bg-green-500': notification.type === 'success',
            'bg-red-500': notification.type === 'error',
            'bg-blue-500': notification.type === 'info'
          }"
          class="rounded-lg shadow-lg p-3 md:p-4 text-white"
        >
          <div class="flex items-center">
            <CheckCircle v-if="notification.type === 'success'" class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0" />
            <XCircle v-if="notification.type === 'error'" class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0" />
            <AlertCircle v-if="notification.type === 'info'" class="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0" />
            <p class="text-xs md:text-sm font-medium">{{ notification.message }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  CheckCircle, 
  XCircle, 
  User, 
  ArrowLeft, 
  ChevronRight, 
  Share2, 
  Bookmark, 
  Calendar, 
  Eye, 
  ExternalLink, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-vue-next'
import NavigationOverlay from '@/components/NavigationOverlay.vue'
import { useNewsStore } from '@/stores/newsStore'
import { useUserStore } from '@/stores/userStore'
import type { News, Comment } from '@/types'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()
const userStore = useUserStore()

// State
const loading = ref(true)
const error = ref<string | null>(null)
const news = ref<News | null>(null)
const comments = ref<Comment[]>([])
const newComment = ref('')
const commentVoteType = ref<'real' | 'fake' | null>(null)
const submittingComment = ref(false)
const userVote = ref<'real' | 'fake' | null>(null)
const notification = ref<{message: string, type: 'success' | 'error' | 'info', show: boolean}>({
  message: '',
  type: 'info',
  show: false
})

// Computed
const hasVoted = computed(() => userVote.value !== null)

const confidenceScore = computed(() => {
  if (!news.value) return 0
  const total = news.value.realVotes + news.value.fakeVotes
  if (total === 0) return 50
  return Math.round((news.value.realVotes / total) * 100)
})

const totalVotes = computed(() => {
  return (news.value?.realVotes || 0) + (news.value?.fakeVotes || 0)
})

// Methods
const loadNewsDetail = async () => {
  try {
    loading.value = true
    error.value = null
    
    const newsId = route.params.id as string
    console.log('Loading news with ID:', newsId)
    
    if (!newsId) {
      error.value = 'Invalid news ID'
      return
    }
    
    // Load news details
    const newsData = await newsStore.fetchNewsById(newsId)
    console.log('Fetched news data:', newsData)
    
    if (!newsData) {
      error.value = 'News not found'
      return
    }
    
    news.value = newsData
    
    // Load comments
    try {
      const loadedComments = await newsStore.fetchCommentsByNewsId(newsId)
      // Sort comments by creation date (newest first)
      comments.value = loadedComments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } catch (commentErr) {
      console.warn('Failed to load comments:', commentErr)
      // Don't fail the entire page if comments fail to load
      comments.value = []
    }
    
    // Check if user has voted
    try {
      const existingVote = userStore.getUserVoteForNews(newsId)
      if (existingVote) {
        userVote.value = existingVote.voteType
      }
    } catch (voteErr) {
      console.warn('Failed to load user vote:', voteErr)
      // Don't fail the entire page if vote check fails
    }
    
  } catch (err) {
    console.error('Error loading news details:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load news details'
  } finally {
    loading.value = false
  }
}

const vote = async (voteType: 'real' | 'fake') => {
  if (!news.value || hasVoted.value) return
  
  const originalVote = userVote.value
  const originalRealVotes = news.value.realVotes
  const originalFakeVotes = news.value.fakeVotes
  
  // Optimistic update
  userVote.value = voteType
  if (voteType === 'real') {
    news.value.realVotes++
  } else {
    news.value.fakeVotes++
  }
  
  try {
    await newsStore.submitVote({
      newsId: news.value.id,
      voteType
    })
    
    // Show success message
    showNotification('Vote submitted successfully!', 'success')
    
  } catch (err) {
    // Revert optimistic update
    userVote.value = originalVote
    news.value.realVotes = originalRealVotes
    news.value.fakeVotes = originalFakeVotes
    
    console.error('Failed to submit vote:', err)
    showNotification('Failed to submit vote. Please try again.', 'error')
  }
}

const submitComment = async () => {
  if (!news.value || !newComment.value.trim() || !commentVoteType.value) {
    showNotification('Please fill in all required fields.', 'error')
    return
  }
  
  submittingComment.value = true
  
  try {
    const comment = await newsStore.submitComment({
      newsId: news.value.id,
      content: newComment.value.trim(),
      voteType: commentVoteType.value,
      author: 'Anonymous User', // Default author name
    })
    
    if (comment) {
      // Add new comment to the beginning of the list (newest first)
      comments.value.unshift(comment)
      
      // Clear form
      newComment.value = ''
      commentVoteType.value = null
      
      showNotification('Comment posted successfully!', 'success')
    } else {
      throw new Error('Failed to create comment')
    }
    
  } catch (err) {
    console.error('Failed to submit comment:', err)
    showNotification('Failed to post comment. Please try again.', 'error')
  } finally {
    submittingComment.value = false
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'real': return 'badge-real'
    case 'fake': return 'badge-fake'
    case 'pending': return 'badge-pending'
    default: return 'badge-neutral'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'real': return 'Verified Real'
    case 'fake': return 'Verified Fake'
    case 'pending': return 'Under Review'
    default: return 'Unknown'
  }
}

const getVoteTypeClass = (voteType: string) => {
  return voteType === 'real' ? 'badge-real' : 'badge-fake'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getConfidenceBarClass = () => {
      const score = confidenceScore.value
      if (score >= 70) return 'bg-green-500'
      if (score >= 40) return 'bg-yellow-500'
      return 'bg-red-500'
    }

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
      notification.value = { message, type, show: true }
      setTimeout(() => {
        notification.value.show = false
      }, 3000)
    }

const goBack = () => {
  // 检查是否有历史记录
  if (window.history.length > 1) {
    router.back()
  } else {
    // 如果没有历史记录，导航到首页
    router.push('/')
  }
}

const shareNews = () => {
  if (navigator.share && news.value) {
    navigator.share({
      title: news.value.title,
      text: news.value.summary,
      url: window.location.href
    })
  }
}

const bookmarkNews = () => {
  // 实现书签功能
  console.log('Bookmark news')
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-news.jpg'
}

// Lifecycle
onMounted(() => {
  loadNewsDetail()
})
</script>