import { showExpToast } from '@/components/ui/sonner/ExpToast/ExpToast'
import popupService, { type Popup, type PopupToday } from '@/services/popupService'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRoute, type RouteLocationNormalizedLoaded } from 'vue-router'
import { useAuthStore } from './auth'

export const usePopupStore = defineStore('pagePopup', () => {
  // State
  const openPopupModal = ref(false)
  const popupContent = ref<Popup | null>(null)

  const allowedRoutes = ['/home', '/learn', '/leaderboard'];
  // Actions
  const openPopup = () => {
    openPopupModal.value = true
  }
  const closePopup = () => {
    openPopupModal.value = false
  }

  const loadPopup = async ( route: RouteLocationNormalizedLoaded) => {
    // Logic to load popup content can be added here
    try {
      const response = ref<PopupToday | null>(null);
      
      if (allowedRoutes.includes(route.path) && useAuthStore().User.exp > 0) {
        response.value =  await popupService.get_today() as PopupToday
      }
      

      if (!response.value?.show) {
        openPopupModal.value = true
        const pendingResponse: Popup = await popupService.get_pending_popups()
        popupContent.value = pendingResponse
      } 
      
    } catch (error) {
      console.error('Error loading popup content:', error)
    }
  }

  return {
    openPopupModal,
    popupContent,
    openPopup,
    closePopup,
    loadPopup
  }
})
