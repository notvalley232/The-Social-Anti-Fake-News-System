<template>
  <nav class="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/30 to-transparent">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo Section -->
        <div class="flex items-center space-x-3">
          <router-link to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-white">
              <h1 class="text-xl font-bold">TruthCheck</h1>
              <p class="text-xs text-white/80">Anti-Fake News</p>
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <template v-for="item in navigationItems" :key="item.path">
            <button
              v-if="item.isCustomAction"
              @click="handleNavigationClick(item)"
              class="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
              :class="{ 'text-blue-200': $route.path === item.path }"
            >
              {{ item.label }}
            </button>
            <router-link
              v-else
              :to="item.path"
              class="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
              :class="{ 'text-blue-200': $route.path === item.path }"
            >
              {{ item.label }}
            </router-link>
          </template>
        </div>

        <!-- Action Buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <div class="flex items-center space-x-3">
            <div v-if="currentUser?.avatar" class="w-8 h-8 rounded-full overflow-hidden">
              <img :src="currentUser.avatar" alt="avatar" class="w-full h-full object-cover" />
            </div>
            <div class="text-white text-sm">
              <div class="font-semibold">{{ currentUser?.username || currentUser?.email || 'Guest' }}</div>
              <div class="text-white/70">{{ currentUser?.role || 'READER' }}</div>
            </div>
          </div>
          <button
            @click="onLogout"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-lg flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 text-white hover:text-blue-200 transition-colors duration-200"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="mobileMenuOpen"
          class="md:hidden mt-4 bg-black/50 backdrop-blur-md rounded-lg p-4"
        >
          <div class="flex flex-col space-y-3">
            <template v-for="item in navigationItems" :key="item.path">
              <button
                v-if="item.isCustomAction"
                @click="handleNavigationClick(item); closeMobileMenu()"
                class="text-white hover:text-blue-200 transition-colors duration-200 font-medium py-2 text-left"
                :class="{ 'text-blue-200': $route.path === item.path }"
              >
                {{ item.label }}
              </button>
              <router-link
                v-else
                :to="item.path"
                @click="closeMobileMenu"
                class="text-white hover:text-blue-200 transition-colors duration-200 font-medium py-2"
                :class="{ 'text-blue-200': $route.path === item.path }"
              >
                {{ item.label }}
              </router-link>
            </template>
            <hr class="border-white/20">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div v-if="currentUser?.avatar" class="w-8 h-8 rounded-full overflow-hidden">
                  <img :src="currentUser.avatar" alt="avatar" class="w-full h-full object-cover" />
                </div>
                <div class="text-white text-sm">
                  <div class="font-semibold">{{ currentUser?.username || currentUser?.email || 'Guest' }}</div>
                  <div class="text-white/70">{{ currentUser?.role || 'READER' }}</div>
                </div>
              </div>
              <button
                @click="onLogout(); closeMobileMenu()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { NavigationItem } from '@/types'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const route = useRoute()

const mobileMenuOpen = ref(false)
const store = useUserStore()
const currentUser = computed(() => store.currentUser)

const navigationItems: NavigationItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Latest News', path: '/news', isCustomAction: true },
  { label: 'Fact Check', path: '/fact-check' },
  { label: 'About', path: '/about' },
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const onLogout = async () => {
  const res = await store.logout()
  if (res.success) {
    router.push('/login')
  }
}

const handleNavigationClick = async (item: NavigationItem) => {
  if (item.isCustomAction && item.label === 'Latest News') {
    // 跳转到主页并滚动到新闻分类部分
    await router.push('/')
    // 等待路由跳转完成后再滚动
    setTimeout(() => {
      const element = document.getElementById('latest-news-section')
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }
    }, 100)
  } else {
    // 普通路由跳转
    router.push(item.path)
  }
}

// Close mobile menu when route changes
router.afterEach(() => {
  closeMobileMenu()
})
</script>

<style scoped>
/* Custom backdrop blur for better browser support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Active link styling */
.router-link-active {
  color: rgb(191 219 254); /* blue-200 */
}

/* Hover effects */
.hover\:opacity-80:hover {
  opacity: 0.8;
}

/* Mobile menu animation */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
