<template>
  <div class="min-h-screen bg-background-secondary">
    <!-- Navigation -->
    <NavigationOverlay />
    
    <!-- Main Content -->
    <main class="pt-20 pb-12">
      <div class="container-responsive">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-text-primary mb-4">About Anti-Fake News System</h1>
            <p class="text-xl text-text-secondary">
              Empowering communities to fight misinformation through collective verification
            </p>
          </div>

          <!-- Mission Section -->
          <section class="bg-white rounded-xl shadow-soft p-8 mb-8">
            <h2 class="text-2xl font-semibold text-text-primary mb-4">Our Mission</h2>
            <p class="text-text-secondary leading-relaxed mb-4">
              In an era where information spreads faster than ever, distinguishing between real and fake news 
              has become crucial for maintaining an informed society. Our platform leverages the power of 
              community-driven verification to help identify and combat misinformation.
            </p>
            <p class="text-text-secondary leading-relaxed">
              We believe that by working together, we can create a more trustworthy information ecosystem 
              where truth prevails over deception.
            </p>
          </section>

          <!-- How It Works -->
          <section class="bg-white rounded-xl shadow-soft p-8 mb-8">
            <h2 class="text-2xl font-semibold text-text-primary mb-6">How It Works</h2>
            <div class="grid md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 class="text-lg font-semibold text-text-primary mb-2">Submit News</h3>
                <p class="text-text-secondary">
                  Community members submit news articles for verification and fact-checking.
                </p>
              </div>
              
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h3 class="text-lg font-semibold text-text-primary mb-2">Community Votes</h3>
                <p class="text-text-secondary">
                  Users vote on the authenticity of news articles based on evidence and research.
                </p>
              </div>
              
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h3 class="text-lg font-semibold text-text-primary mb-2">Verification</h3>
                <p class="text-text-secondary">
                  Articles are marked as verified real, fake, or pending based on community consensus.
                </p>
              </div>
            </div>
          </section>

          <!-- Features -->
          <section class="bg-white rounded-xl shadow-soft p-8 mb-8">
            <h2 class="text-2xl font-semibold text-text-primary mb-6">Key Features</h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span class="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-text-primary">Community-Driven Verification</h4>
                    <p class="text-text-secondary text-sm">
                      Harness collective intelligence for accurate fact-checking
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span class="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-text-primary">Real-time Updates</h4>
                    <p class="text-text-secondary text-sm">
                      Get instant notifications about verification status changes
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span class="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-text-primary">Advanced Search</h4>
                    <p class="text-text-secondary text-sm">
                      Find specific news articles with powerful filtering options
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span class="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-text-primary">Transparency</h4>
                    <p class="text-text-secondary text-sm">
                      All verification processes are open and transparent
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span class="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-text-primary">User-Friendly Interface</h4>
                    <p class="text-text-secondary text-sm">
                      Intuitive design makes fact-checking accessible to everyone
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span class="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-text-primary">Mobile Responsive</h4>
                    <p class="text-text-secondary text-sm">
                      Access the platform from any device, anywhere
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Team -->
          <section class="bg-white rounded-xl shadow-soft p-8 mb-8">
            <h2 class="text-2xl font-semibold text-text-primary mb-6">Our Team</h2>
            <p class="text-text-secondary leading-relaxed mb-6">
              We are a dedicated team of developers, researchers, and fact-checking enthusiasts 
              committed to building tools that help combat misinformation and promote media literacy.
            </p>
            <div class="grid md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span class="text-2xl">👨‍💻</span>
                </div>
                <h4 class="font-semibold text-text-primary">Development Team</h4>
                <p class="text-text-secondary text-sm">Building robust and scalable solutions</p>
              </div>
              
              <div class="text-center">
                <div class="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span class="text-2xl">🔬</span>
                </div>
                <h4 class="font-semibold text-text-primary">Research Team</h4>
                <p class="text-text-secondary text-sm">Studying misinformation patterns and trends</p>
              </div>
              
              <div class="text-center">
                <div class="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span class="text-2xl">🛡️</span>
                </div>
                <h4 class="font-semibold text-text-primary">Moderation Team</h4>
                <p class="text-text-secondary text-sm">Ensuring quality and preventing abuse</p>
              </div>
            </div>
          </section>

          <!-- Contact -->
          <section class="bg-white rounded-xl shadow-soft p-8">
            <h2 class="text-2xl font-semibold text-text-primary mb-4">Get Involved</h2>
            <p class="text-text-secondary leading-relaxed mb-6">
              Join our mission to fight misinformation. Whether you're a developer, researcher, 
              journalist, or simply someone who cares about truth, there's a place for you in our community.
            </p>
            <div class="flex flex-wrap gap-4">
              <button @click="$router.push('/submit')" class="btn btn-primary">
                Submit News
              </button>
              <button @click="$router.push('/contact')" class="btn btn-secondary">
                Contact Us
              </button>
              <button @click="$router.push('/guidelines')" class="btn btn-ghost">
                Read Guidelines
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import NavigationOverlay from '@/components/NavigationOverlay.vue'
</script>