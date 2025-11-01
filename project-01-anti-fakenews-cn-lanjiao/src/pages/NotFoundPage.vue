<template>
  <div class="min-h-screen bg-background-secondary flex items-center justify-center">
    <div class="text-center max-w-md mx-auto px-6">
      <!-- 404 Icon -->
      <div class="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <span class="text-6xl">🔍</span>
      </div>
      
      <!-- Error Message -->
      <h1 class="text-6xl font-bold text-primary-600 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-text-primary mb-4">Page Not Found</h2>
      <p class="text-text-secondary mb-8 leading-relaxed">
        The page you're looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button @click="$router.push('/')" class="btn btn-primary">
          Back to Home
        </button>
        <button @click="$router.go(-1)" class="btn btn-secondary">
          Go Back
        </button>
        <button @click="$router.push('/search')" class="btn btn-ghost">
          Search News
        </button>
      </div>
      
      <!-- Helpful Links -->
      <div class="mt-12 pt-8 border-t border-border">
        <h3 class="text-lg font-semibold text-text-primary mb-4">Popular Pages</h3>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <router-link to="/about" class="text-primary-600 hover:text-primary-700 transition-colors">
            About Us
          </router-link>
          <router-link to="/submit" class="text-primary-600 hover:text-primary-700 transition-colors">
            Submit News
          </router-link>
          <router-link to="/how-it-works" class="text-primary-600 hover:text-primary-700 transition-colors">
            How It Works
          </router-link>
          <router-link to="/contact" class="text-primary-600 hover:text-primary-700 transition-colors">
            Contact
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Update page title
onMounted(() => {
  document.title = '404 - Page Not Found | Anti-Fake News'
})
</script>