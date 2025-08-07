import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Badge1 from '/levels/badge1.svg'
import Badge2 from '/levels/badge2.svg'
import Badge3 from '/levels/badge3.svg'
import Badge4 from '/levels/badge4.svg'
import Badge5 from '/levels/badge5_wide.svg'
import Badge6 from '/levels/badge6.svg'
import { useAuthStore } from './auth'
import { LevelService } from '@/services'

export interface level {
  id: number
  number: number
  name: string
  xp_required: number
  rank: number
}

export const useLevelStore = defineStore('level', () => {
  // levels
  const levels = ref([
    { id: 1, image: Badge1 },
    { id: 2, image: Badge2 },
    { id: 3, image: Badge3 },
    { id: 4, image: Badge4 },
    { id: 5, image: Badge5 },
    { id: 6, image: Badge6 },
  ])
  // State
  const level_list = ref()
  const authStore = useAuthStore()
  const currentLevel = computed(() => authStore.User?.level || 1)

  // Actions
  const currentBadge = computed(() => {
    return levels.value.find((badge) => badge.id === currentLevel.value) || levels.value[0]
  })
  const nextBadge = computed(() => {
    return levels.value.find((badge) => badge.id === currentLevel.value + 1) || levels.value[0]
  })

  const currentSelectedLevel = computed(() => {
    return level_list.value?.find((level: level) => level.id === currentLevel.value) || level_list.value[0]
  })

  // Methods
  const loadLevel = async () => {
    try {
      const response = await LevelService.get_all()
      level_list.value = response || 1
    } catch (error) {
      console.error('Error loading level:', error)
    }
  }

  return {
    currentLevel,
    currentBadge,
    nextBadge,
    loadLevel,
    level_list,
    currentSelectedLevel
  }
})
