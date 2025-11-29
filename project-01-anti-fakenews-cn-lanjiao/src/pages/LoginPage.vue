<template>
  <div class="min-h-screen bg-background-primary">
    <NavigationOverlay />
    <section class="relative h-screen flex items-center justify-center">
      <VideoBackground>
        <div class="container-responsive relative z-10 w-full max-w-md mx-auto pt-24">
          <div class="p-6 md:p-8 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl text-white shadow-xl">
            <h1 class="text-3xl font-bold mb-6 text-center">Login</h1>
            <form @submit.prevent="onSubmit" class="space-y-4">
              <input v-model="email" type="email" placeholder="Email" class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-white/70" />
              <input v-model="password" type="password" placeholder="Password" class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-white/70" />
              <button type="submit" class="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-colors">Sign In</button>
            </form>
            <p class="mt-4 text-sm text-white/80 text-center">No account? <router-link class="text-blue-300 hover:text-blue-200" to="/register">Register</router-link></p>
            <p v-if="error" class="mt-2 text-red-300 text-sm text-center">{{ error }}</p>
          </div>
        </div>
      </VideoBackground>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import NavigationOverlay from '@/components/NavigationOverlay.vue'
import VideoBackground from '@/components/VideoBackground.vue'

const router = useRouter()
const route = useRoute()
const store = useUserStore()
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

const onSubmit = async () => {
  const res = await store.login({ email: email.value, password: password.value })
  if (res.success) {
    store.saveCurrentUser()
    router.push({ name: 'home' })
  } else {
    error.value = res.error || 'Login failed'
  }
}

onMounted(() => {
  if (route.query.redirected === '1') {
    const msg = localStorage.getItem('auth_message') || 'Please login or register first'
    error.value = msg
    try { localStorage.removeItem('auth_message') } catch {}
  }
})
</script>

<style scoped>
</style>
