import popupService, { type Popup, type PopupToday } from '@/services/popupService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePopupStore = defineStore('pagePopup', () => {
  // State
  const openPopupModal = ref(false)
  const popupContent = ref<Popup | null>(null)

  // Actions
  const openPopup = () => {
    openPopupModal.value = true
  }
  const closePopup = () => {
    openPopupModal.value = false
  }

  const loadPopup = async () => {
    // Logic to load popup content can be added here
    try {
      const response: PopupToday = await popupService.get_today()
      if (!response.show) {
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
