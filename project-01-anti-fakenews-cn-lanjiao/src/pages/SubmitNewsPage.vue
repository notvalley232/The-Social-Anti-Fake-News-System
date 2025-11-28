<template>
  <div class="min-h-screen bg-background-secondary">
    <!-- Navigation -->
    <NavigationOverlay />
    
    
    <!-- Main Content -->
    <main class="pt-20 pb-12">
      <div class="container-responsive">
        <div class="max-w-2xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-text-primary mb-4">Submit News for Verification</h1>
            <p class="text-lg text-text-secondary">
              Help the community by submitting news articles for fact-checking and verification.
            </p>
          </div>

          <!-- Submission Form -->
          <div class="bg-white rounded-xl shadow-soft p-6">
            <form @submit.prevent="submitNews" class="space-y-6">
              <!-- Title -->
              <div>
                <label for="title" class="block text-sm font-medium text-text-primary mb-2">
                  News Title *
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="Enter the news headline..."
                  class="input w-full"
                  :class="{ 'border-red-300': errors.title }"
                />
                <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
              </div>

              <!-- Summary -->
              <div>
                <label for="summary" class="block text-sm font-medium text-text-primary mb-2">
                  Summary *
                </label>
                <textarea
                  id="summary"
                  v-model="form.summary"
                  required
                  rows="3"
                  placeholder="Provide a brief summary of the news..."
                  class="input w-full resize-none"
                  :class="{ 'border-red-300': errors.summary }"
                ></textarea>
                <p v-if="errors.summary" class="mt-1 text-sm text-red-600">{{ errors.summary }}</p>
              </div>

              <!-- Content -->
              <div>
                <label for="content" class="block text-sm font-medium text-text-primary mb-2">
                  Full Content *
                </label>
                <textarea
                  id="content"
                  v-model="form.content"
                  required
                  rows="8"
                  placeholder="Paste or type the full news content here..."
                  class="input w-full resize-none"
                  :class="{ 'border-red-300': errors.content }"
                ></textarea>
                <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
              </div>

              <!-- Image Upload -->
              <div>
                <h3 class="text-center text-lg font-semibold text-gray-900 mb-3">The image of new</h3>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  @change="onFileChange"
                  class="sr-only"
                />
                <div class="border rounded-lg p-4">
                  <div class="grid grid-cols-2 gap-4">
                    <label for="imageFile" class="flex items-center justify-center border-2 border-dashed rounded-lg h-32 cursor-pointer hover:border-primary-500">
                      <Plus class="w-10 h-10 text-primary-500" />
                    </label>
                    <div v-if="imagePreview" class="relative border rounded-lg overflow-hidden h-32">
                      <img :src="imagePreview" alt="preview" class="w-full h-full object-cover" />
                      <button @click="removeImage" type="button" class="absolute top-2 right-2 bg-white text-gray-700 rounded-full shadow w-7 h-7 flex items-center justify-center">
                        ×
                      </button>
                    </div>
                    <div v-else class="flex items-center justify-center text-sm text-gray-600 border rounded-lg h-32">
                      No file selected
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-text-secondary">
                    Upload related image. Supported: jpg, jpeg, png, gif
                  </p>
                </div>
              </div>

              <!-- Category -->
              <div>
                <label for="category" class="block text-sm font-medium text-text-primary mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  v-model="form.category"
                  required
                  class="input w-full"
                  :class="{ 'border-red-300': errors.category }"
                >
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

              <!-- Source Information -->
              <div>
                <label for="reporter" class="block text-sm font-medium text-text-primary mb-2">
                  Source/Reporter
                </label>
                <input
                  id="reporter"
                  v-model="form.reporter"
                  type="text"
                  placeholder="Original source or reporter name"
                  class="input w-full"
                />
                <p class="mt-1 text-sm text-text-secondary">
                  Optional: Mention the original source or reporter
                </p>
              </div>

              <!-- Source URL -->
              <div>
                <label for="sourceUrl" class="block text-sm font-medium text-text-primary mb-2">
                  Source URL
                </label>
                <input
                  id="sourceUrl"
                  v-model="form.sourceUrl"
                  type="url"
                  placeholder="https://example.com/original-article"
                  class="input w-full"
                  :class="{ 'border-red-300': errors.sourceUrl }"
                />
                <p v-if="errors.sourceUrl" class="mt-1 text-sm text-red-600">{{ errors.sourceUrl }}</p>
                <p class="mt-1 text-sm text-text-secondary">
                  Optional: Link to the original article or source
                </p>
              </div>

              <!-- Initial Assessment -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">
                  Your Initial Assessment
                </label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="form.initialAssessment"
                      type="radio"
                      value="real"
                      class="mr-2"
                    />
                    <span class="text-accent-real font-medium">I believe this is real</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="form.initialAssessment"
                      type="radio"
                      value="fake"
                      class="mr-2"
                    />
                    <span class="text-accent-fake font-medium">I believe this is fake</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="form.initialAssessment"
                      type="radio"
                      value="unsure"
                      class="mr-2"
                    />
                    <span class="text-text-secondary font-medium">I'm not sure</span>
                  </label>
                </div>
              </div>

              <!-- Additional Notes -->
              <div>
                <label for="notes" class="block text-sm font-medium text-text-primary mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  rows="3"
                  placeholder="Any additional context, concerns, or observations..."
                  class="input w-full resize-none"
                ></textarea>
                <p class="mt-1 text-sm text-text-secondary">
                  Optional: Provide any additional context that might help with verification
                </p>
              </div>

              <!-- Terms Agreement -->
              <div class="flex items-start">
                <input
                  id="agreeTerms"
                  v-model="form.agreeTerms"
                  type="checkbox"
                  required
                  class="mt-1 mr-3"
                />
                <label for="agreeTerms" class="text-sm text-text-secondary">
                  I agree that the information provided is accurate to the best of my knowledge and 
                  I understand that this submission will be reviewed by the community for verification.
                </label>
              </div>

              <!-- Submit Button -->
              <div class="flex gap-4">
                <button
                  type="submit"
                  :disabled="submitting || !isFormValid"
                  class="btn btn-primary btn-lg flex-1"
                >
                  <span v-if="submitting">Submitting...</span>
                  <span v-else>Submit for Verification</span>
                </button>
                <button
                  type="button"
                  @click="resetForm"
                  class="btn btn-secondary btn-lg"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          <!-- Guidelines -->
          <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-blue-900 mb-3">Submission Guidelines</h3>
            <ul class="space-y-2 text-sm text-blue-800">
              <li>• Ensure the news content is complete and accurate</li>
              <li>• Provide credible sources when possible</li>
              <li>• Avoid submitting duplicate news articles</li>
              <li>• Be respectful and objective in your assessment</li>
              <li>• Include relevant context that might help verification</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavigationOverlay from '@/components/NavigationOverlay.vue'
import { useNewsStore } from '@/stores/newsStore'
import { dataService } from '@/services/dataService'
import { Plus } from 'lucide-vue-next'

const router = useRouter()
const newsStore = useNewsStore()

// Form state
const form = ref({
  title: '',
  summary: '',
  content: '',
  imageUrl: '',
  category: '',
  reporter: '',
  sourceUrl: '',
  initialAssessment: '',
  notes: '',
  agreeTerms: false
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)

// Computed
const isFormValid = computed(() => {
  return form.value.title.trim() &&
         form.value.summary.trim() &&
         form.value.content.trim() &&
         form.value.category &&
         form.value.agreeTerms &&
         Object.keys(errors.value).length === 0
})

// Methods
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
  } else if (form.value.title.length < 10) {
    errors.value.title = 'Title must be at least 10 characters'
  }
  
  if (!form.value.summary.trim()) {
    errors.value.summary = 'Summary is required'
  } else if (form.value.summary.length < 20) {
    errors.value.summary = 'Summary must be at least 20 characters'
  }
  
  if (!form.value.content.trim()) {
    errors.value.content = 'Content is required'
  } else if (form.value.content.length < 50) {
    errors.value.content = 'Content must be at least 50 characters'
  }
  
  if (!form.value.category) {
    errors.value.category = 'Category is required'
  }
  
  
  
  if (form.value.sourceUrl && !isValidUrl(form.value.sourceUrl)) {
    errors.value.sourceUrl = 'Please enter a valid URL'
  }
  
  return Object.keys(errors.value).length === 0
}

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const submitNews = async () => {
  if (!validateForm()) return
  submitting.value = true
  try {
    let imageUrl = form.value.imageUrl
    if (selectedFile.value) {
      try {
        imageUrl = await dataService.uploadImage(selectedFile.value)
      } catch (uploadErr) {
        console.error('Image upload failed, continue without image', uploadErr)
      }
    }
    const created = await newsStore.submitNews({
      title: form.value.title,
      summary: form.value.summary,
      content: form.value.content,
      imageUrl,
      category: form.value.category,
      reporter: form.value.reporter,
      sourceUrl: form.value.sourceUrl
    })
    if (created) {
      resetForm()
      router.push('/')
    }
  } catch (e) {
    console.error('Failed to submit news', e)
  } finally {
    submitting.value = false
  }
}


const resetForm = () => {
  form.value = {
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    category: '',
    reporter: '',
    sourceUrl: '',
    initialAssessment: '',
    notes: '',
    agreeTerms: false
  }
  errors.value = {}
}

const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const selectedFileName = computed(() => selectedFile.value ? selectedFile.value.name : 'No file selected')
const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) {
    selectedFile.value = null
    imagePreview.value = null
    return
  }
  selectedFile.value = files[0]
  imagePreview.value = URL.createObjectURL(files[0])
}

const removeImage = () => {
  selectedFile.value = null
  imagePreview.value = null
}
</script>