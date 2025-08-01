import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LearnView from '@/views/LearnView.vue'
import HomeView from '@/views/HomeView.vue'
import BadgeView from '@/views/BadgeView.vue'
import ShopView from '@/views/ShopView.vue'
import modules from '@/views/Learn/ModuleView.vue'
import index from '@/views/Learn/SessionContents.vue'
import login from '@/views/Authentication/signup.vue'
import SuccessVerify from '@/views/Authentication/successVerify.vue'
import { useAuthStore } from '@/stores/auth'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'



const requireAuthenticated = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    next({
      path: '/login'
    });
  } else {
    next(
    );
  }
};

export const redirectLogout = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  authStore.logout().then(() => next('/login'))
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'Home',
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
      component: ShopView,
    },
    {
      path: '/learn',
      name: 'Learn',
      component: LearnView,
    },
    {
      path: '/learn/:lessonId',
      name: 'Learn-Phishing',
      component: modules
    },
    {
      path: '/learn/:lessonId/session',
      name: 'phishing1',
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

export default router
