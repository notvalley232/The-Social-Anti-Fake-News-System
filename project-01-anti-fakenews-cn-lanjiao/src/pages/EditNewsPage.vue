<template>
  <div class="min-h-screen bg-background-secondary">
    <NavigationOverlay />
    <main class="pt-20 pb-12">
      <div class="container-responsive">
        <div class="max-w-2xl mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-text-primary mb-4">Edit News</h1>
            <p class="text-lg text-text-secondary">Update the article details and save your changes.</p>
          </div>
          <div class="bg-white rounded-xl shadow-soft p-6">
            <form @submit.prevent="submitEdit" class="space-y-6">
              <div>
                <label for="title" class="block text-sm font-medium text-text-primary mb-2">News Title *</label>
                <input id="title" v-model="form.title" type="text" required class="input w-full" :class="{ 'border-red-300': errors.title }" />
                <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
              </div>
              <div>
                <label for="summary" class="block text-sm font-medium text-text-primary mb-2">Summary *</label>
                <textarea id="summary" v-model="form.summary" required rows="3" class="input w-full resize-none" :class="{ 'border-red-300': errors.summary }"></textarea>
                <p v-if="errors.summary" class="mt-1 text-sm text-red-600">{{ errors.summary }}</p>
              </div>
              <div>
                <label for="content" class="block text-sm font-medium text-text-primary mb-2">Full Content *</label>
                <textarea id="content" v-model="form.content" required rows="8" class="input w-full resize-none" :class="{ 'border-red-300': errors.content }"></textarea>
                <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
              </div>
              <div>
                <h3 class="text-center text-lg font-semibold text-gray-900 mb-3">Article image</h3>
                <input id="imageFile" type="file" accept="image/*" @change="onFileChange" class="sr-only" />
                <div class="border rounded-lg p-4">
                  <div class="grid grid-cols-2 gap-4">
                    <label for="imageFile" class="flex items-center justify-center border-2 border-dashed rounded-lg h-32 cursor-pointer hover:border-primary-500">
                      <Plus class="w-10 h-10 text-primary-500" />
                    </label>
                    <div v-if="imagePreview || form.imageUrl" class="relative border rounded-lg overflow-hidden h-32">
                      <img :src="imagePreview || form.imageUrl" alt="preview" class="w-full h-full object-cover" />
                      <button @click="removeImage" type="button" class="absolute top-2 right-2 bg-white text-gray-700 rounded-full shadow w-7 h-7 flex items-center justify-center">×</button>
                    </div>
                    <div v-else class="flex items-center justify-center text-sm text-gray-600 border rounded-lg h-32">No file selected</div>
                  </div>
                  <p class="mt-2 text-sm text-text-secondary">Upload related image. Supported: jpg, jpeg, png, gif</p>
                </div>
              </div>
              <div>
                <label for="category" class="block text-sm font-medium text-text-primary mb-2">Category *</label>
                <select id="category" v-model="form.category" required class="input w-full" :class="{ 'border-red-300': errors.category }">
                  <option value="">Select a category</option>
                  <option value="technology">Technology</option>
                  <option value="health">Health</option>
                  <option value="politics">Politics</option>
                  <option value="science">Science</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="sports">Sports</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
                <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
              </div>
              <div>
                <label for="reporter" class="block text-sm font-medium text-text-primary mb-2">Source/Reporter</label>
                <input id="reporter" v-model="form.reporter" type="text" class="input w-full" />
              </div>
              <div>
                <label for="sourceUrl" class="block text-sm font-medium text-text-primary mb-2">Source URL</label>
                <input id="sourceUrl" v-model="form.sourceUrl" type="url" class="input w-full" :class="{ 'border-red-300': errors.sourceUrl }" />
                <p v-if="errors.sourceUrl" class="mt-1 text-sm text-red-600">{{ errors.sourceUrl }}</p>
              </div>
              <div class="flex gap-4">
                <button type="submit" :disabled="submitting || !isFormValid" class="btn btn-primary btn-lg flex-1">
                  <span v-if="submitting">Saving...</span>
                  <span v-else>Save Changes</span>
                </button>
                <button type="button" @click="cancelEdit" class="btn btn-secondary btn-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavigationOverlay from '@/components/NavigationOverlay.vue'
import { useNewsStore } from '@/stores/newsStore'
import { dataService } from '@/services/dataService'
import { Plus } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

const form = ref({
  title: '',
  summary: '',
  content: '',
  imageUrl: '',
  category: '',
  reporter: '',
  sourceUrl: ''
})
const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

const isFormValid = computed(() => {
  return form.value.title.trim() &&
         form.value.summary.trim() &&
         form.value.content.trim() &&
         form.value.category &&
         Object.keys(errors.value).length === 0
})

const isValidUrl = (url: string) => { try { new URL(url); return true } catch { return false } }

const validateForm = () => {
  errors.value = {}
  if (!form.value.title.trim()) errors.value.title = 'Title is required'
  if (!form.value.summary.trim()) errors.value.summary = 'Summary is required'
  if (!form.value.content.trim()) errors.value.content = 'Content is required'
  if (!form.value.category) errors.value.category = 'Category is required'
  if (form.value.sourceUrl && !isValidUrl(form.value.sourceUrl)) errors.value.sourceUrl = 'Please enter a valid URL'
  return Object.keys(errors.value).length === 0
}

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) { selectedFile.value = null; imagePreview.value = null; return }
  selectedFile.value = files[0]
  imagePreview.value = URL.createObjectURL(files[0])
}

const removeImage = () => { selectedFile.value = null; imagePreview.value = null }

const submitEdit = async () => {
  if (!validateForm()) return
  submitting.value = true
  try {
    const id = route.params.id as string
    let imageUrl = form.value.imageUrl
    if (selectedFile.value) {
      try { imageUrl = await dataService.uploadImage(selectedFile.value) } catch (uploadErr) { console.error('Image upload failed', uploadErr) }
    }
    const updated = await newsStore.updateNews(id, {
      title: form.value.title,
      summary: form.value.summary,
      content: form.value.content,
      imageUrl,
      category: form.value.category,
      reporter: form.value.reporter,
      sourceUrl: form.value.sourceUrl
    })
    if (updated) router.push(`/news/${id}`)
  } catch (e) {
    console.error('Failed to update news', e)
  } finally {
    submitting.value = false
  }
}

const cancelEdit = () => { const id = route.params.id as string; router.push(`/news/${id}`) }

onMounted(async () => {
  const id = route.params.id as string
  const data = await newsStore.fetchNewsById(id)
  if (data) {
    form.value = {
      title: data.title,
      summary: data.summary,
      content: data.content,
      imageUrl: data.imageUrl || '',
      category: data.category || '',
      reporter: data.reporter || '',
      sourceUrl: data.sourceUrl || ''
    }
  }
})
</script>