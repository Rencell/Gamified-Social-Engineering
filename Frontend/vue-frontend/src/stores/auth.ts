import { defineStore } from 'pinia'
import { AuthService } from '@/services'
import { computed, reactive, ref } from 'vue'
import { type RouteLocationNormalizedLoaded, type Router, useRoute, useRouter } from 'vue-router'

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
  }) //User

  const isAuthenticated = computed(() => !!localStorage.getItem(TOKEN_STORAGE) )

  const actionStates = reactive({
    authenticating: false,
    error: false,
    token: '' as string | null,
  })

  const init = async () => {
    try {
      if (!isAuthenticated.value) {
        throw new Error('No token found in localStorage')
      }
      const token = actionStates.token
      MUTATIONS.SET_TOKEN(localStorage.getItem(TOKEN_STORAGE) as string)

      const response = await AuthService.getUser()
      User.value = response.data
    } catch (error) {
      console.warn('Failed to fetch current user, using fake data as fallback:', error)
      User.value = {
        pk: 1,
        username: 'testuser',
        email: 'test@example.com',
      }
    }
  }

  const registration = async (payload: Register) => {
    MUTATIONS.LOGIN_BEGIN()
    try {
      const response = await AuthService.register(payload)
      console.log('Registration successful:', response)
      MUTATIONS.SET_TOKEN(response.data['key'])
      MUTATIONS.ACTION_TERMINATE()
      init();
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
      init();
    } catch (error) {
      console.error('Login failed:', error)
      MUTATIONS.LOGIN_FAILURE()
    }
  }

  const logout = async () => {
    try {
      
      await AuthService.logout()
      MUTATIONS.REMOVE_TOKEN()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      MUTATIONS.ACTION_TERMINATE()
      console.log('User logged out')
    }
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
    logout,
    isAuthenticated,
    actionStates,
  }
})
