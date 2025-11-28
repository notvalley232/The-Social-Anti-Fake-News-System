import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import NewsDetailPage from '@/pages/NewsDetailPage.vue'
import SearchPage from '@/pages/SearchPage.vue'
import SubmitNewsPage from '@/pages/SubmitNewsPage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import ComingSoonPage from '@/pages/ComingSoonPage.vue'

// Define route configurations
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {
      title: 'Home - Anti-Fake News System',
      description: 'Community-driven platform for news verification and fact-checking'
    }
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/pages/HomePage.vue'),
    meta: {
      title: 'Latest News - Anti-Fake News System',
      description: 'Browse the latest news articles and fact-checks'
    }
  },
  {
    path: '/news/:id',
    name: 'news-detail',
    component: () => import('@/pages/NewsDetailPage.vue'),
    meta: {
      title: 'News Detail - Anti-Fake News System',
      description: 'Read full news article and participate in verification'
    }
  },
  {
    path: '/news/:id/edit',
    name: 'news-edit',
    component: () => import('@/pages/EditNewsPage.vue'),
    meta: {
      title: 'Edit News - Anti-Fake News System',
      description: 'Edit a news article'
    }
  },
  {
    path: '/fact-check',
    name: 'fact-check',
    component: () => import('@/pages/SearchPage.vue'),
    meta: {
      title: 'Fact Check - Anti-Fake News System',
      description: 'Explore fact-checked articles and verification results'
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/pages/SearchPage.vue'),
    meta: {
      title: 'Search Results - Anti-Fake News System',
      description: 'Search and filter news articles'
    }
  },
  {
    path: '/submit',
    name: 'submit-news',
    component: () => import('@/pages/SubmitNewsPage.vue'),
    meta: {
      title: 'Submit News - Anti-Fake News System',
      description: 'Submit news articles for community verification'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/AboutPage.vue'),
    meta: {
      title: 'About - Anti-Fake News System',
      description: 'Learn about our mission to combat misinformation'
    }
  },
  {
    path: '/how-it-works',
    name: 'how-it-works',
    component: ComingSoonPage,
    meta: {
      title: 'How It Works - Anti-Fake News',
      description: 'Learn how our community-driven verification process works'
    }
  },
  {
    path: '/guidelines',
    name: 'guidelines',
    component: ComingSoonPage,
    meta: {
      title: 'Community Guidelines - Anti-Fake News',
      description: 'Rules and best practices for our community'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: ComingSoonPage,
    meta: {
      title: 'Contact Us - Anti-Fake News',
      description: 'Get in touch with our team'
    }
  },
  {
    path: '/category/:category',
    name: 'category',
    component: ComingSoonPage,
    meta: {
      title: 'Category - Anti-Fake News',
      description: 'Browse news by category'
    }
  },
  // Catch-all route for 404 pages
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: {
      title: '404 - Page Not Found',
      description: 'The page you are looking for does not exist'
    }
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top when navigating to a new route
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Global navigation guards
router.beforeEach((to, from, next) => {
  // Update document title
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription && to.meta?.description) {
    metaDescription.setAttribute('content', to.meta.description as string)
  }
  
  // Add loading state (can be used with Pinia store)
  // This will be implemented when we set up the store
  
  next()
})

router.afterEach((to, from) => {
  // Remove loading state
  // This will be implemented when we set up the store
  
  // Track page views (analytics can be added here)
  console.log(`Navigated from ${String(from.name)} to ${String(to.name)}`)
})

export default router
