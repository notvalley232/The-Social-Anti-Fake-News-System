<template>
  <div 
    class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
    :class="{ 'ring-2 ring-blue-500 ring-opacity-50': isFeatured }"
    @click="handleCardClick"
  >
    <!-- News Image -->
    <div class="relative overflow-hidden">
      <img
        :src="news.imageUrl"
        :alt="news.title"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        @error="handleImageError"
      />
      
      <!-- Status Badge -->
      <div class="absolute top-4 left-4">
        <span
          class="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
          :class="getStatusBadgeClass(news.status)"
        >
          {{ getStatusLabel(news.status) }}
        </span>
      </div>

      <!-- Category Badge -->
      <div class="absolute top-4 right-4 flex flex-col space-y-2">
        <span class="px-3 py-1 bg-black/50 text-white text-xs font-medium rounded-full backdrop-blur-sm">
          {{ news.category }}
        </span>
        <!-- Featured Badge -->
        <span 
          v-if="isFeatured" 
          class="px-3 py-1 bg-blue-500/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm border border-blue-300"
        >
          Featured
        </span>
      </div>

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <!-- Card Content -->
    <div class="p-6">
      <!-- Title -->
      <h3 class="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
        {{ news.title }}
      </h3>

      <!-- Summary -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ news.summary }}
      </p>

      <!-- Meta Information -->
      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div class="flex items-center space-x-2">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{{ news.reporter }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ formatDate(news.createdAt) }}</span>
        </div>
      </div>

      <!-- Voting Section -->
      <div class="flex items-center justify-between">
        <!-- Vote Counts -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-1">
            <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm font-medium text-gray-700">{{ news.realVotes }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
            </svg>
            <span class="text-sm font-medium text-gray-700">{{ news.fakeVotes }}</span>
          </div>
        </div>

        <!-- Vote Buttons -->
        <div class="flex items-center space-x-2">
          <button
            @click.stop="handleVote('real')"
            class="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            :class="userVote === 'real' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Real</span>
          </button>
          
          <button
            @click.stop="handleVote('fake')"
            class="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            :class="userVote === 'fake' 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Fake</span>
          </button>
        </div>
      </div>

      <!-- Confidence Indicator -->
      <div class="mt-4">
        <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Community Confidence</span>
          <span>{{ confidencePercentage }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="getConfidenceBarClass()"
            :style="{ width: `${confidencePercentage}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Hover Action Overlay -->
    <div class="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { News } from '@/types'

interface Props {
  news: News
  isFeatured?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  vote: [newsId: string, voteType: 'real' | 'fake']
  click: [newsId: string]
}>()

// Local state for user vote (this would come from Pinia store in real app)
const userVote = ref<'real' | 'fake' | null>(null)

// Computed properties
const confidencePercentage = computed(() => {
  const totalVotes = props.news.realVotes + props.news.fakeVotes
  if (totalVotes === 0) return 50
  
  const realPercentage = (props.news.realVotes / totalVotes) * 100
  return Math.round(realPercentage)
})

// Methods
const getStatusBadgeClass = (status: string) => {
  const classes = {
    real: 'bg-green-100/90 text-green-800 border border-green-200',
    fake: 'bg-red-100/90 text-red-800 border border-red-200',
    pending: 'bg-yellow-100/90 text-yellow-800 border border-yellow-200'
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

const getConfidenceBarClass = () => {
  const percentage = confidencePercentage.value
  if (percentage >= 70) return 'bg-green-500'
  if (percentage >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Today'
  if (diffDays === 2) return 'Yesterday'
  if (diffDays <= 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=news%20placeholder%20image%20professional%20journalism&image_size=landscape_4_3'
}

const handleVote = (voteType: 'real' | 'fake') => {
  // Toggle vote if same type, otherwise set new vote
  if (userVote.value === voteType) {
    userVote.value = null
  } else {
    userVote.value = voteType
  }
  
  emit('vote', props.news.id, voteType)
}

const handleCardClick = () => {
  emit('click', props.news.id)
}
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

/* Custom hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:text-blue-600 {
  color: #2563eb;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Button hover animations */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom backdrop blur for better browser support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Loading animation for images */
img {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

img[src] {
  animation: none;
  background: none;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Confidence bar animation */
.confidence-bar {
  transition: width 0.5s ease-in-out;
}

/* Card shadow enhancement */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .line-clamp-2 {
    -webkit-line-clamp: 1;
  }
  
  .line-clamp-3 {
    -webkit-line-clamp: 2;
  }
}
</style>