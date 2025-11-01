<template>
  <div class="min-h-screen bg-background-secondary">
    <!-- Navigation -->
    <NavigationOverlay />
    
    <!-- Main Content -->
    <main class="pt-20 pb-12">
      <div class="container-responsive">
        <div class="max-w-2xl mx-auto text-center">
          <!-- Icon -->
          <div class="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <span class="text-4xl">🚧</span>
          </div>
          
          <!-- Title -->
          <h1 class="text-4xl font-bold text-text-primary mb-4">
            {{ pageTitle }}
          </h1>
          
          <!-- Description -->
          <p class="text-xl text-text-secondary mb-8">
            {{ pageDescription }}
          </p>
          
          <!-- Coming Soon Message -->
          <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
            <h2 class="text-2xl font-semibold text-text-primary mb-4">Coming Soon</h2>
            <p class="text-text-secondary leading-relaxed mb-6">
              We're working hard to bring you this feature. Stay tuned for updates and 
              new functionality that will enhance your experience on our platform.
            </p>
            
            <!-- Features Preview -->
            <div class="grid md:grid-cols-2 gap-4 text-left">
              <div v-for="feature in upcomingFeatures" :key="feature" class="flex items-center gap-2">
                <div class="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span class="text-text-secondary text-sm">{{ feature }}</span>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-4 justify-center">
            <button @click="$router.push('/')" class="btn btn-primary">
              Back to Home
            </button>
            <button @click="$router.go(-1)" class="btn btn-secondary">
              Go Back
            </button>
            <button @click="$router.push('/about')" class="btn btn-ghost">
              Learn More
            </button>
          </div>
          
          <!-- Newsletter Signup -->
          <div class="mt-12 bg-primary-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-text-primary mb-2">Stay Updated</h3>
            <p class="text-text-secondary mb-4">
              Get notified when this feature becomes available
            </p>
            <div class="flex gap-2 max-w-md mx-auto">
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="input flex-1"
              />
              <button @click="subscribeToUpdates" class="btn btn-primary">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavigationOverlay from '@/components/NavigationOverlay.vue'

const route = useRoute()
const email = ref('')

// Page content based on route
const pageContent = computed(() => {
  const routeName = route.name as string
  
  switch (routeName) {
    case 'how-it-works':
      return {
        title: 'How It Works',
        description: 'Learn about our verification process and how the community helps fight misinformation.',
        features: [
          'Step-by-step verification guide',
          'Community voting system',
          'Fact-checking methodology',
          'Quality assurance process'
        ]
      }
    case 'guidelines':
      return {
        title: 'Community Guidelines',
        description: 'Rules and best practices for participating in our fact-checking community.',
        features: [
          'Submission guidelines',
          'Voting best practices',
          'Community standards',
          'Moderation policies'
        ]
      }
    case 'contact':
      return {
        title: 'Contact Us',
        description: 'Get in touch with our team for support, feedback, or partnership opportunities.',
        features: [
          'Support ticket system',
          'Live chat support',
          'Partnership inquiries',
          'Feedback submission'
        ]
      }
    case 'category':
      return {
        title: 'Category View',
        description: 'Browse news articles by specific categories and topics.',
        features: [
          'Category filtering',
          'Topic-based organization',
          'Advanced sorting options',
          'Trending topics'
        ]
      }
    default:
      return {
        title: 'Page Under Development',
        description: 'This page is currently being developed and will be available soon.',
        features: [
          'Enhanced user experience',
          'New functionality',
          'Improved performance',
          'Better accessibility'
        ]
      }
  }
})

const pageTitle = computed(() => pageContent.value.title)
const pageDescription = computed(() => pageContent.value.description)
const upcomingFeatures = computed(() => pageContent.value.features)

const subscribeToUpdates = () => {
  if (!email.value) {
    alert('Please enter a valid email address')
    return
  }
  
  // Simulate subscription
  alert(`Thank you! We'll notify you at ${email.value} when this feature is ready.`)
  email.value = ''
}
</script>