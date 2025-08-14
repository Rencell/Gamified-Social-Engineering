import { defineStore } from 'pinia'
import { AuthService, RewardService } from '@/services'
import { computed, reactive, ref, watch } from 'vue'
import { type RouteLocationNormalizedLoaded, type Router, useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useLevelStore } from './level'

export interface Register {
  username: string
  email: string
  password1: string
  password2: string
}

interface LoginPayload {
  username?: string
  email?: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const TOKEN_STORAGE = 'auth_token'

  const User = ref<any>({
    pk: 1,
    username: 'testuser',
    email: '',
    exp: 0,
    coin: 0,
    level: 1,
  }) //User

  watch(
    () => User.value.exp,
    (newExp, oldExp) => {
      if (oldExp < 0 && newExp < oldExp) 
        return;

      if(newExp >= useLevelStore().currentSelectedLevel.xp_required) {
        toast.success(`Congratulations you just reached ${User.value.level + 1}`, {
          action: {
            label: 'Close',
            onClick: () => console.log('Closed notification'),
          },
          position: 'top-right',
          duration: 5000,
        })
      }
      
    },
  )

  const actionStates = reactive({
    authenticating: false,
    error: false,
    token: localStorage.getItem(TOKEN_STORAGE) || null,
  })

  const isAuthenticated = computed(() => !!actionStates.token)

  const clearUser = () => {
    User.value = null
  }

  const init = async () => {
    if (!isAuthenticated.value) {
      return clearUser()
    }

    try {
      const token = actionStates.token
      if (token) MUTATIONS.SET_TOKEN(token)
      await refreshUser()
    } catch (error) {
      console.warn('Failed to fetch current user, using fallback:', error)
      clearUser()
    }
  }

  const refreshUser = async () => {
    const userRes = await AuthService.getUser()
    const rewardRes = await RewardService.user_stats(userRes.data.pk)

    User.value = {
      ...userRes.data,
      exp: rewardRes.exp,
      coin: rewardRes.coins,
      level: rewardRes.level,
    }
  }

  const registration = async (payload: Register) => {
    MUTATIONS.LOGIN_BEGIN()
    try {
      const response = await AuthService.register(payload)
      console.log('Registration successful:', response)
      MUTATIONS.SET_TOKEN(response.data['key'])
      MUTATIONS.ACTION_TERMINATE()
      init()
    } catch (error) {
      console.error('Login failed:', error)
      MUTATIONS.LOGIN_FAILURE()
    }
  }

  const login = async (
    payload: LoginPayload,
    router: Router,
    route: RouteLocationNormalizedLoaded,
  ) => {
    MUTATIONS.LOGIN_BEGIN()
    try {
      const response = await AuthService.login(payload)
      MUTATIONS.SET_TOKEN(response.data['key'])
      MUTATIONS.LOGIN_SUCCESS(router, route)
      init()
    } catch (error) {
      console.error('Login failed:', error)
      MUTATIONS.LOGIN_FAILURE()
    }
  }

  const logout = async () => {
    await AuthService.logout().catch(() => {})
    MUTATIONS.REMOVE_TOKEN()
    clearUser()
    MUTATIONS.ACTION_TERMINATE()
  }

  const MUTATIONS = {
    SET_USER: () => {},
    LOGIN_BEGIN: () => {
      actionStates.authenticating = true
      actionStates.error = false
    },
    LOGIN_SUCCESS: (router: Router, route: RouteLocationNormalizedLoaded) => {
      actionStates.authenticating = false
      actionStates.error = false
      const redirectPath = route.query.redirect || '/home'
      router.push(redirectPath as string)
    },

    LOGIN_FAILURE: () => {
      actionStates.authenticating = false
      actionStates.error = true
    },
    ACTION_TERMINATE: () => {
      actionStates.authenticating = false
      actionStates.error = false
    },

    SET_TOKEN: (token: string) => {
      localStorage.setItem(TOKEN_STORAGE, token)
      AuthService.setToken(token)
      actionStates.token = token
    },
    REMOVE_TOKEN: () => {
      localStorage.removeItem(TOKEN_STORAGE)
      AuthService.removeToken()
      actionStates.token = null
    },
  }
  return {
    init,
    User,
    login,
    registration,
    refreshUser,
    logout,
    isAuthenticated,
    actionStates,
  }
})
