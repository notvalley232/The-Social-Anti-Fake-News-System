<template>
  <div class="min-h-screen bg-background-primary">
    <NavigationOverlay />
    <section class="relative h-screen flex items-center justify-center">
      <VideoBackground>
        <div class="container-responsive relative z-10 w-full max-w-md mx-auto pt-24">
          <div class="p-6 md:p-8 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl text-white shadow-xl">
            <h1 class="text-3xl font-bold mb-6 text-center">Register</h1>
            <form @submit.prevent="onSubmit" class="space-y-4">
              <input v-model="firstName" type="text" placeholder="First Name" class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-white/70" />
              <input v-model="lastName" type="text" placeholder="Last Name" class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-white/70" />
              <input v-model="email" type="email" placeholder="Email" class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-white/70" />
              <input v-model="password" type="password" placeholder="Password" class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-white/70" />
              <input @change="onFileChange" type="file" accept="image/*" class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none" />
              <button type="submit" class="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-colors">Create Account</button>
            </form>
            <p class="mt-4 text-sm text-white/80 text-center">Have an account? <router-link class="text-blue-300 hover:text-blue-200" to="/login">Login</router-link></p>
            <p v-if="error" class="mt-2 text-red-300 text-sm text-center">{{ error }}</p>
          </div>
        </div>
      </VideoBackground>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import NavigationOverlay from '@/components/NavigationOverlay.vue'
import VideoBackground from '@/components/VideoBackground.vue'

const router = useRouter()
const store = useUserStore()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const avatarFile = ref<File | null>(null)
const error = ref<string | null>(null)

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  avatarFile.value = files && files[0] ? files[0] : null
}

const onSubmit = async () => {
  if (!avatarFile.value) {
    error.value = 'Avatar image required'
    return
  }
  const res = await store.register({ firstName: firstName.value, lastName: lastName.value, email: email.value, password: password.value, avatarFile: avatarFile.value })
  if (res.success) {
    store.saveCurrentUser()
    router.push({ name: 'home' })
  } else {
    error.value = res.error || 'Registration failed'
  }
}
</script>

<style scoped>
</style>
