import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LearnView from '@/views/LearnView.vue'
import HomeView from '@/views/HomeView.vue'
import modules from '@/views/Learn/Phishing/modules.vue'
import WhatPhishing from '@/views/Learn/Phishing/Modules/WhatPhishing.vue'
import index from '@/views/Learn/Phishing/Modules/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/learn',
      name: 'Learn',
      component: LearnView,
    },
    {
      path: '/learn/:lessonId',
      name: 'Learn-Phishing',
      component: modules,
    },
    {
      path: '/learn/:lessonId/session',
      name: 'phishing1',
      component: index,
      meta: { layout: 'fullscreen' }
    },
  ],
})

export default router
