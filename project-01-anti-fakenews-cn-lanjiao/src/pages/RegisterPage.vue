<template>
  <div class="min-h-screen flex items-center justify-center bg-black/80 text-white">
    <div class="w-full max-w-md p-6 bg-white/5 backdrop-blur rounded-xl border border-white/10">
      <h1 class="text-2xl font-semibold mb-6">Register</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <input v-model="firstName" type="text" placeholder="First Name" class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none" />
        <input v-model="lastName" type="text" placeholder="Last Name" class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none" />
        <input v-model="email" type="email" placeholder="Email" class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none" />
        <input v-model="password" type="password" placeholder="Password" class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none" />
        <input @change="onFileChange" type="file" accept="image/*" class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none" />
        <button type="submit" class="w-full py-2 rounded bg-blue-600 hover:bg-blue-700">Create Account</button>
      </form>
      <p class="mt-4 text-sm">Have an account? <router-link class="text-blue-400" to="/login">Login</router-link></p>
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

