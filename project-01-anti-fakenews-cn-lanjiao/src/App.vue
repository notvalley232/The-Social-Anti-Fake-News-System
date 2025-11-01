<template>
  <router-view v-slot="{ Component, route }">
    <transition
      :name="getTransitionName(route)"
      mode="out-in"
      @enter="onEnter"
      @leave="onLeave"
    >
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'
import { track } from '@vercel/analytics'

const router = useRouter()

// 根据路由确定过渡动画类型
const getTransitionName = (route: any) => {
  // 新闻详情页使用滑入效果
  if (route.name === 'news-detail') {
    return 'slide-left'
  }
  // 搜索页使用淡入效果
  if (route.name === 'search') {
    return 'fade'
  }
  // 默认使用淡入效果
  return 'fade'
}

// 过渡动画钩子
const onEnter = (el: Element) => {
  // 页面进入时滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const onLeave = (el: Element) => {
  // 页面离开时的处理
}

// 监听路由变化，跟踪页面访问
watch(() => router.currentRoute.value, (to, from) => {
  if (to.path !== from?.path) {
    // 跟踪页面访问
    track('page_view', {
      page: to.path,
      title: (to.meta?.title as string) || (to.name as string) || 'Unknown Page'
    })
  }
}, { immediate: true })
</script>

<style>
/* 淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 左滑过渡 - 用于新闻详情页 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 右滑过渡 - 用于返回操作 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 缩放过渡 */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 页面加载动画 */
@keyframes pageLoad {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-enter {
  animation: pageLoad 0.5s ease-out;
}
</style>