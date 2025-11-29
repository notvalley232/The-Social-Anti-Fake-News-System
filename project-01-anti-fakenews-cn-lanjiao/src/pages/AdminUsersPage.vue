<template>
  <div class="min-h-screen bg-background-secondary">
    <NavigationOverlay />
    <main class="pt-20 pb-12">
      <div class="container-responsive">
        <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-soft p-6">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold text-text-primary">User Management</h1>
            <div class="text-sm text-text-secondary">Only administrators can access this page</div>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Avatar</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Role</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Created At</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="u in users" :key="u.id">
                  <td class="px-4 py-2">
                    <img v-if="u.avatarUrl" :src="u.avatarUrl" class="w-10 h-10 rounded-full object-cover" />
                  </td>
                  <td class="px-4 py-2 text-sm text-gray-900">{{ u.firstName }} {{ u.lastName }}</td>
                  <td class="px-4 py-2 text-sm text-gray-700">{{ u.email }}</td>
                  <td class="px-4 py-2">
                    <select v-model="u.role" class="input w-auto" :disabled="u.role === 'ADMIN'">
                      <option value="READER">Reader</option>
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN" disabled>Admin</option>
                    </select>
                  </td>
                  <td class="px-4 py-2 text-sm text-gray-600">{{ formatDate(u.createdAt) }}</td>
                  <td class="px-4 py-2">
                    <button @click="saveRole(u)" :disabled="u.role === 'ADMIN'" class="btn btn-primary btn-sm">Update</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="message" class="mt-4 text-sm" :class="messageType === 'success' ? 'text-green-600' : 'text-red-600'">{{ message }}</div>
        </div>
      </div>
    </main>
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2"
    >
      <div v-if="notification.show" class="fixed top-4 right-4 z-50 max-w-xs w-full mx-4">
        <div :class="{ 'bg-green-500': notification.type === 'success', 'bg-red-500': notification.type === 'error', 'bg-blue-500': notification.type === 'info' }" class="rounded-lg shadow-lg p-3 text-white">
          <p class="text-sm font-medium">{{ notification.message }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavigationOverlay from '@/components/NavigationOverlay.vue'
import { dataService } from '@/services/dataService'

const users = ref<Array<{ id: string; email: string; firstName: string; lastName: string; avatarUrl?: string; role: 'READER' | 'MEMBER' | 'ADMIN'; createdAt: string }>>([])
const message = ref<string>('')
const messageType = ref<'success' | 'error'>('success')
const notification = ref<{message: string, type: 'success' | 'error' | 'info', show: boolean}>({ message: '', type: 'info', show: false })
const showNotification = (msg: string, type: 'success' | 'error' | 'info') => {
  notification.value = { message: msg, type, show: true }
  setTimeout(() => { notification.value.show = false }, 3000)
}

const loadUsers = async () => {
  try {
    const res = await dataService.fetchAllUsers()
    users.value = res
  } catch (e) {
    message.value = 'Failed to load users'
    messageType.value = 'error'
  }
}

const saveRole = async (u: any) => {
  try {
    const res = await dataService.updateUserRole(u.id, u.role)
    message.value = 'User role updated successfully'
    messageType.value = 'success'
    showNotification('User role updated successfully', 'success')
  } catch (e) {
    message.value = 'Failed to update user role'
    messageType.value = 'error'
    showNotification('Failed to update user role', 'error')
  }
}

const formatDate = (s: string) => {
  try {
    return new Date(s).toLocaleString()
  } catch {
    return s
  }
}

onMounted(loadUsers)
</script>
