<template>
  <div class="min-h-screen flex items-center justify-center bg-black/80 text-white">
    <div class="w-full max-w-md p-6 bg-white/5 backdrop-blur rounded-xl border border-white/10">
      <h1 class="text-2xl font-semibold mb-6">Login</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <input v-model="email" type="email" placeholder="Email" class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none" />
        <input v-model="password" type="password" placeholder="Password" class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none" />
        <button type="submit" class="w-full py-2 rounded bg-blue-600 hover:bg-blue-700">Sign In</button>
      </form>
      <p class="mt-4 text-sm">No account? <router-link class="text-blue-400" to="/register">Register</router-link></p>
      <p v-if="error" class="mt-2 text-red-400 text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
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
</script>

<style scoped>
</style>

