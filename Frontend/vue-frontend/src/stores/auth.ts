import { defineStore } from 'pinia'
import { AuthService, RewardService } from '@/services'
import { computed, reactive, ref, watch } from 'vue'
import { type RouteLocationNormalizedLoaded, type Router } from 'vue-router'
import { toast } from 'vue-sonner'
import { useLevelStore } from './level'
import type { Authentication } from '@/services/authService'
import { playSoundFx, SoundFx } from '@/composables/useSoundFx'

export const useAuthStore = defineStore('auth', () => {
  const TOKEN_STORAGE = 'auth_token'

  //User
  const User = ref<Authentication>({
    pk: 1,
    username: 'testuser',
    email: '',
    daily_streak: 0,
    exp: 0,
    coin: 0,
    rank: 0,
    level: 1,
    is_admin: false,
  }) 

  const new_created = ref(false);
  watch(
    () => User.value.exp,
    (newExp, oldExp) => {
      if (oldExp < 0 && newExp < oldExp) 
        return;

      if (!useLevelStore().currentSelectedLevel) {
        return;
      }
      if(newExp >= useLevelStore().currentSelectedLevel.xp_required) {
        toast.success(`Congratulations you just reached ${User.value.level + 1}`, {
          action: {
            label: 'Close',
            onClick: () => console.log('Closed notification'),
          },
          position: 'top-right',
          duration: 5000,
        })
        playSoundFx(SoundFx.LevelUp)
      }
      
    },
  )

  const actionStates = reactive({
    authenticating: false,
    error: false,
    token: localStorage.getItem(TOKEN_STORAGE) || null,
  })

  const isAuthenticated = computed(() => !!actionStates.token)


  const isAuthenticatedCheck = async (): Promise<boolean> => {
    try {
      const response = await AuthService.getUser()
      return !!response.data
    } catch {
      return false
    }
  }

  const clearUser = () => {
    User.value = {
      pk: 1,
      username: 'testuser',
      email: '',
      exp: 0,
      coin: 0,
      level: 1,
      daily_streak: 0,
      is_admin: false,
      rank: 0,
    }
  }

  const init = async () => {
    if (User.value.username !== 'testuser') {
      return
    }
    if (!(await isAuthenticatedCheck())) {
      clearUser()
    }
    try {
      const token = actionStates.token
      if (token) MUTATIONS.SET_TOKEN(token)
      await refreshUser()
    } catch (error) {
      console.warn('Failed to fetch current user, using fallback:', error)
      MUTATIONS.REMOVE_TOKEN()
      // clearUser()
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
      rank: rewardRes.rank,
      daily_streak: rewardRes.daily_streak,
      // role: 'admin',
    }
     
  }

  const loginWithGoogle = async (
    response: string,
    router: Router,
    route: RouteLocationNormalizedLoaded,
  ) => {
    try{
      const res = await AuthService.loginGoogle({access_token: response})
      
      if(res.data.is_new) {
        new_created.value = true;
      }
      if(res.data.key){
        console.log(res.data.key)
        MUTATIONS.SET_TOKEN(res.data.key)
        await init()
        MUTATIONS.LOGIN_SUCCESS(router, route)
      }
    }catch(error: unknown){
      console.error('Login failed:', error)
      MUTATIONS.LOGIN_FAILURE()
      // Re-throw so the caller (UI) can show a toast based on backend response.
      throw error
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
      if(new_created.value){
        router.push('/onboarding');
        return;
      }
      const redirectPath = route.query.redirect || '/home/'
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
      console.log("SET TOKEN")
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
    new_created,
    loginWithGoogle,
    refreshUser,
    logout,
    isAuthenticated,
    isAuthenticatedCheck,
    actionStates,
  }
})
