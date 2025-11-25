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
import LeaderboardView from '@/views/LeaderboardView.vue'
import MiniGameView from '@/views/MiniGameView.vue'
import MiniGameViewDetailed from '@/views/MiniGame/MiniGameDetailed.vue'
import settingsView from '@/views/settingsView.vue'
import EmailSimulationView from '@/views/Simulation/EmailSimulationView.vue'
import SmsSimulation from '@/views/Simulation/SmsSimulation.vue'
import AssessmentView from '@/views/AssessmentView.vue'
import assessmentEdittable from '@/views/Assessment/assessmentEdittable.vue'
import shibalDetail from '@/components/Assessment/shibalDetail.vue'


import { requireAuthenticated, redirectLogout } from './guards'
import { useLoadingPageStore } from '@/stores/pageLoading'
import { set } from '@vueuse/core'
import AssessmentSession from '@/views/Assessment/assessmentSession.vue'
import AssessmentEdittable from '@/views/Assessment/assessmentEdittable.vue'
import AssessmentReport from '@/views/Assessment/assessmentReport.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
      path: '/leaderboard',
      name: 'Leaderboard',
      beforeEnter: requireAuthenticated,
      component: LeaderboardView,
    },
    {
      path: '/badges',
      name: 'Badges',
      beforeEnter: requireAuthenticated,
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
      path: '/minigames',
      name: 'MiniGames',
      beforeEnter: requireAuthenticated,
      component: MiniGameView,
    },
    {
      path: '/assessments',
      name: 'Assessments',
      beforeEnter: requireAuthenticated,
      component: AssessmentView,
    },
    {
      path: '/assessments/:id',
      name: 'AssessmentDetail',
      beforeEnter: requireAuthenticated,
      component: shibalDetail,
    },
    {
      path: '/assessment/session/:id/start',
      name: 'AssessmentSession',
      beforeEnter: requireAuthenticated,
      component: AssessmentSession,
      meta: { layout: 'fullscreen' }
    },
    {
      path: '/assessment/session/:id/report',
      name: 'AssessmentReport',
      beforeEnter: requireAuthenticated,
      component: AssessmentReport,
      meta: { layout: 'fullscreen' }
    },
    {
      path: '/assessment/question/:id/edit',
      name: 'AssessmentEdittable',
      beforeEnter: requireAuthenticated,
      component: AssessmentEdittable,
      meta: { layout: 'fullscreen' }
    },
    {
      path: '/settings',
      name: 'Settings',
      beforeEnter: requireAuthenticated,
      component: settingsView,
    },
    {
      path: '/minigames/:gameId',
      name: 'MiniGamesDetail',
      beforeEnter: requireAuthenticated,
      component: MiniGameViewDetailed,
    },
    {
      path: '/learn/:lessonId',
      name: 'Learn-Phishing',
      beforeEnter: requireAuthenticated,
      component: modules
    },
    {
      path: '/learn/:lessonId/:sectionId/session',
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
    {
      path: '/simulation',
      name: 'simulation',
      beforeEnter: requireAuthenticated,
      component: EmailSimulationView,
    },
    {
      path: '/sms-simulation',
      name: 'sms-simulation',
      beforeEnter: requireAuthenticated,
      component: SmsSimulation,
    }
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
