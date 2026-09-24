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
import SafeBrowsingView from '@/views/Simulation/SafeBrowsingView.vue'
import shibalDetail from '@/components/Assessment/shibalDetail.vue'
import NotFound from '@/views/NotFound.vue'

import { requireAuthenticated, redirectLogout } from './guards'
import { useLoadingPageStore } from '@/stores/pageLoading'
import AssessmentSession from '@/views/Assessment/assessmentSession.vue'
import AssessmentEdittable from '@/views/Assessment/assessmentEdittable.vue'
import AssessmentReport from '@/views/Assessment/assessmentReport.vue'
import onboarding_slide1 from '@/components/onboarding/slide1.vue'
import onboarding_slide2 from '@/components/onboarding/slide2.vue'
import onboarding_slide3 from '@/components/onboarding/slide3.vue'
import onboarding_slide4 from '@/components/onboarding/slide4.vue'

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
      path: '/assessment/:a_id/session/:s_id/report',
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
      path: '/safe-browsing',
      name: 'safe-browsing',
      beforeEnter: requireAuthenticated,
      component: SafeBrowsingView,
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
    },
    {
      path: '/onboarding',
      name: 'Onboarding',
      beforeEnter: requireAuthenticated,
      component: onboarding_slide1,
      meta: { layout: 'fullscreen' },
    },
    {
      path: '/onboarding/avatar',
      name: 'Onboarding2',
      beforeEnter: requireAuthenticated,
      component: onboarding_slide2,
      meta: { layout: 'fullscreen' },
    },
    {
      path: '/onboarding/email-simulation',
      name: 'Onboarding3',
      beforeEnter: requireAuthenticated,
      component: onboarding_slide3,
      meta: { layout: 'fullscreen' },
    },
    {
      path: '/onboarding/sms-simulation',
      name: 'Onboarding4',
      beforeEnter: requireAuthenticated,
      component: onboarding_slide4,
      meta: { layout: 'fullscreen' },
    },
    // Catch-all 404 route (place at the very end)
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
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
