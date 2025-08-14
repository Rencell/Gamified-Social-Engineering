import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/level'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'


export const requireAuthenticated = async (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {

  const authStore = useAuthStore();
  const levelStore = useLevelStore();
  await authStore.init()
  await levelStore.loadLevel();
  
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
