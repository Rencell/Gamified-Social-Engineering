import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/level'
import { useStreakStore } from '@/stores/pageStreak';
import { usePopupStore } from '@/stores/popup';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'


export const requireAuthenticated = async (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {

  
  const authStore = useAuthStore();
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
    if (!await authStore.User.is_admin) {
      await popupStore.loadPopup();
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
