<template>
  <div class="video-background">
    <!-- Video Element -->
    <video
      ref="videoElement"
      :src="videoSrc"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      class="video-element"
      @loadstart="onLoadStart"
      @loadeddata="onLoadedData"
      @error="onError"
      @canplay="onCanPlay"
    />
    
    <!-- Fallback Image -->
    <div
      v-if="showFallback"
      class="fallback-background"
      :style="{ backgroundImage: `url(${fallbackImage})` }"
    />
    
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">Loading video...</p>
      </div>
    </div>
    
    <!-- Overlay Gradient -->
    <div class="video-overlay" />
    
    <!-- Content Slot -->
    <div class="video-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Props {
  videoSrc?: string
  fallbackImage?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  overlayOpacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  videoSrc: 'https://lf9-static.bytednsdoc.com/obj/eden-cn/uhbfnupkbps/video/earth_v6.mp4',
  fallbackImage: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=earth%20from%20space%20blue%20planet%20cosmic%20background&image_size=landscape_16_9',
  autoplay: true,
  muted: true,
  loop: true,
  overlayOpacity: 0.4
})

const videoElement = ref<HTMLVideoElement | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
const isVideoReady = ref(false)

const showFallback = computed(() => hasError.value || !isVideoReady.value)

// Video event handlers
const onLoadStart = () => {
  isLoading.value = true
  hasError.value = false
}

const onLoadedData = () => {
  isLoading.value = false
  isVideoReady.value = true
}

const onError = (event: Event) => {
  console.warn('Video failed to load, using fallback image:', event)
  isLoading.value = false
  hasError.value = true
  isVideoReady.value = false
}

const onCanPlay = () => {
  isLoading.value = false
  if (videoElement.value && props.autoplay) {
    videoElement.value.play().catch((error) => {
      console.warn('Video autoplay failed:', error)
      // Fallback to image if autoplay fails
      hasError.value = true
    })
  }
}

// Intersection Observer for performance optimization
let intersectionObserver: IntersectionObserver | null = null

const setupIntersectionObserver = () => {
  if (!videoElement.value || !('IntersectionObserver' in window)) return

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Video is visible, ensure it's playing
          if (videoElement.value && props.autoplay) {
            videoElement.value.play().catch(() => {
              // Ignore autoplay errors
            })
          }
        } else {
          // Video is not visible, pause to save resources
          if (videoElement.value) {
            videoElement.value.pause()
          }
        }
      })
    },
    { threshold: 0.1 }
  )

  intersectionObserver.observe(videoElement.value)
}

// Lifecycle hooks
onMounted(() => {
  // Set up intersection observer for performance
  setupIntersectionObserver()
  
  // Handle reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    hasError.value = true // Use fallback image instead of video
  }
})

onUnmounted(() => {
  if (intersectionObserver) {
    intersectionObserver.disconnect()
  }
})
</script>

<style scoped>
.video-background {
  @apply relative w-full h-full overflow-hidden;
}

.video-element {
  @apply absolute inset-0 w-full h-full object-cover;
  z-index: 1;
}

.fallback-background {
  @apply absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat;
  z-index: 1;
  background-image: url('https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=earth%20from%20space%20blue%20planet%20cosmic%20background&image_size=landscape_16_9');
}

.loading-overlay {
  @apply absolute inset-0 flex items-center justify-center bg-primary-900 bg-opacity-80;
  z-index: 2;
}

.loading-spinner {
  @apply text-center;
}

.spinner {
  @apply w-12 h-12 border-4 border-white border-opacity-30 border-t-white rounded-full animate-spin mx-auto mb-4;
}

.loading-text {
  @apply text-white text-lg font-medium;
}

.video-overlay {
  @apply absolute inset-0 bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900;
  opacity: v-bind('props.overlayOpacity');
  z-index: 3;
}

.video-content {
  @apply relative w-full h-full;
  z-index: 4;
}

/* Responsive optimizations */
@media (max-width: 768px) {
  .video-element {
    /* On mobile, prioritize performance */
    @apply object-cover;
  }
  
  .loading-text {
    @apply text-base;
  }
  
  .spinner {
    @apply w-8 h-8;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .video-element {
    display: none;
  }
  
  .spinner {
    @apply animate-none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .video-overlay {
    @apply bg-black;
    opacity: 0.6;
  }
}
</style>