import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ProfileView from '@/views/ProfileView.vue'
import LearnView from '@/views/LearnView.vue'
import HomeView from '@/views/HomeView.vue'
import BadgeView from '@/views/BadgeView.vue'
import ShopView from '@/views/ShopView.vue'
import modules from '@/views/Learn/ModuleView.vue'
import index from '@/views/Learn/SessionContents.vue'
import login from '@/views/Authentication/signup.vue'
import InventoryView from '@/views/InventoryView.vue'
import SuccessVerify from '@/views/Authentication/successVerify.vue'
import { requireAuthenticated, redirectLogout } from './guards'
import { useLoadingPageStore } from '@/stores/pageLoading'
import { set } from '@vueuse/core'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'Home',
      beforeEnter: requireAuthenticated,
      component: HomeView,
    },
    {
      path: '/home',
      name: 'Home',
      beforeEnter: requireAuthenticated,
      component: HomeView,
    },
    {
      path: '/badges',
      name: 'Badges',
      component: BadgeView,
    },
    {
      path: '/shop',
      name: 'Shop',
      beforeEnter: requireAuthenticated,
      component: ShopView,
    },
    {
      path: '/inventory-items',
      name: 'Inventory',
      beforeEnter: requireAuthenticated,
      component: InventoryView,
    },
    {
      path: '/learn',
      name: 'Learn',
      beforeEnter: requireAuthenticated,
      component: LearnView,
    },
    {
      path: '/profile',
      name: 'Profile',
      beforeEnter: requireAuthenticated,
      component: ProfileView,
    },
    {
      path: '/learn/:lessonId',
      name: 'Learn-Phishing',
      beforeEnter: requireAuthenticated,
      component: modules
    },
    {
      path: '/learn/:lessonId/session',
      name: 'phishing1',
      beforeEnter: requireAuthenticated,
      component: index,
      meta: { layout: 'fullscreen' }
    },
    {
      path: '/logout',
      name: 'logout',
      component: login,
      beforeEnter: redirectLogout,
      meta: { layout: 'fullscreen' }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: { layout: 'fullscreen' }
    },
    {
      path: '/register',
      name: 'register',
      component: login,
      meta: { layout: 'fullscreen' }
    },
    {
      path: '/email-confirmation/:key',
      name: 'emailconfirm',
      component: SuccessVerify,
      meta: { layout: 'fullscreen' }
    },
  ],
})

router.beforeEach((to, from, next) => {
  useLoadingPageStore().startLoading()
  next()
})

router.afterEach(() => {
  useLoadingPageStore().stopLoading()
  setTimeout(() => {
    useLoadingPageStore().stopLoading()
  }, 300);
})


export default router
