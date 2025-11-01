<template>
  <div class="relative h-screen overflow-hidden">
    <!-- Video Background -->
    <video
      ref="videoRef"
      :src="videoUrl"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      class="absolute inset-0 w-full h-full object-cover"
      @loadstart="handleVideoLoadStart"
      @canplay="handleVideoCanPlay"
      @error="handleVideoError"
    />
    
    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-blue-900 flex items-center justify-center z-20"
    >
      <div class="text-center text-white">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p class="text-lg">Loading Video...</p>
      </div>
    </div>

    <!-- Error Fallback -->
    <div
      v-if="error"
      class="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center z-20"
    >
      <div class="text-center text-white">
        <div class="text-6xl mb-4">🌍</div>
        <p class="text-lg">Video unavailable - using fallback background</p>
      </div>
    </div>

    <!-- Blue Overlay -->
    <div 
      class="absolute inset-0 z-10"
      :style="{ backgroundColor: `rgba(30, 64, 175, ${overlayOpacity})` }"
    />
    
    <!-- Content Overlay -->
    <div class="relative z-20 flex flex-col h-full">
      <!-- Navigation Overlay -->
      <NavigationOverlay v-if="showNavigation" />
      
      <!-- Search Bar Overlay -->
      <SearchBarOverlay v-if="showSearchBar" />
      
      <!-- Main Content Area -->
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center text-white px-4">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Social Anti-Fake News System
          </h1>
          <p class="text-xl md:text-2xl mb-8 drop-shadow-md max-w-3xl mx-auto">
            Empowering communities to identify and combat misinformation through collaborative fact-checking
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="scrollToNews"
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-lg"
            >
              Explore News
            </button>
            <button
              @click="$router.push('/submit')"
              class="bg-white hover:bg-gray-100 text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-lg"
            >
              Submit News
            </button>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavigationOverlay from './NavigationOverlay.vue'
import SearchBarOverlay from './SearchBarOverlay.vue'
import type { VideoHeaderProps } from '@/types'

interface Props extends VideoHeaderProps {}

const props = withDefaults(defineProps<Props>(), {
  videoUrl: 'https://lf9-static.bytednsdoc.com/obj/eden-cn/uhbfnupkbps/video/earth_v6.mp4',
  overlayOpacity: 0.3,
  showNavigation: true,
  showSearchBar: true
})

const router = useRouter()
const videoRef = ref<HTMLVideoElement>()
const loading = ref(true)
const error = ref(false)

const handleVideoLoadStart = () => {
  loading.value = true
  error.value = false
}

const handleVideoCanPlay = () => {
  loading.value = false
  error.value = false
}

const handleVideoError = (event: Event) => {
  console.error('Video loading error:', event)
  loading.value = false
  error.value = true
}

const scrollToNews = () => {
  const newsSection = document.getElementById('news-section')
  if (newsSection) {
    newsSection.scrollIntoView({ behavior: 'smooth' })
  } else {
    // If news section doesn't exist, navigate to home page
    router.push('/')
  }
}

// Optimize video performance
onMounted(() => {
  if (videoRef.value) {
    // Preload video for better performance
    videoRef.value.load()
    
    // Handle visibility change to pause/play video
    const handleVisibilityChange = () => {
      if (videoRef.value) {
        if (document.hidden) {
          videoRef.value.pause()
        } else {
          videoRef.value.play().catch(console.error)
        }
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Cleanup
    onUnmounted(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    })
  }
})
</script>

<style scoped>
/* Ensure video covers the entire container */
video {
  min-width: 100%;
  min-height: 100%;
}

/* Smooth transitions for overlay */
.relative > div {
  transition: opacity 0.3s ease-in-out;
}

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>