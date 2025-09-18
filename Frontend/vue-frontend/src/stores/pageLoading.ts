import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingPageStore = defineStore('pageLoading', () => {
  // State
  const isLoading = ref(false)
  const count = ref(0)
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
    count
  }
})
