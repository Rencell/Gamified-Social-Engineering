import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/level'
import { useStreakStore } from '@/stores/pageStreak';
import { usePopupStore } from '@/stores/popup';
import { useRoute, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'


export const requireAuthenticated = async (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {

  const allowedRoutes = ['/home', '/learn'];
  const authStore = useAuthStore();
  const isAuthValid = authStore.User.exp > 0;
  const route = useRoute();
  const levelStore = useLevelStore();
  const streakStore = useStreakStore();
  const popupStore = usePopupStore();
  // await authStore.init()
  await levelStore.loadLevel();
  if (!await authStore.isAuthenticatedCheck()) {
    next({
      path: '/login'
    });
  } else {
    await streakStore.cacheStreak();
    if (authStore.User.is_admin ) return next();

    // Don't show popups during onboarding flows
    const isOnboarding = _to.path.startsWith('/onboarding/');
    if (!isOnboarding) {
      await popupStore.loadPopup(route);
    }

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
