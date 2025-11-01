<template>
  <div class="min-h-screen bg-background-secondary">
    <!-- Navigation -->
    <NavigationOverlay />
    
    <!-- Message Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Information</h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="mb-6">
          <div class="flex items-center mb-3">
            <div class="flex-shrink-0">
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-gray-700">This feature is not yet implemented</p>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
    
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

              <!-- Image URL -->
              <div>
                <label for="imageUrl" class="block text-sm font-medium text-text-primary mb-2">
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  v-model="form.imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  class="input w-full"
                  :class="{ 'border-red-300': errors.imageUrl }"
                />
                <p v-if="errors.imageUrl" class="mt-1 text-sm text-red-600">{{ errors.imageUrl }}</p>
                <p class="mt-1 text-sm text-text-secondary">
                  Optional: Provide a URL to an image related to this news
                </p>
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
const showModal = ref(false)

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
  
  if (form.value.imageUrl && !isValidUrl(form.value.imageUrl)) {
    errors.value.imageUrl = 'Please enter a valid URL'
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
  
  // Show modal instead of alert
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
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
</script>