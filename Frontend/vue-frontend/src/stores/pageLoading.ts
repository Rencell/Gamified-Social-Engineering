import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingPageStore = defineStore('pageLoading', () => {
  // State
  const isLoading = ref(false)

  // Actions

  const startLoading = () => {
    isLoading.value = true
  }

  const stopLoading = () => {
    isLoading.value = false
  }

  return {
    isLoading,
    startLoading,
    stopLoading,
  }
})
