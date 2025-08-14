import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CosmeticService } from '@/services'
import type { UserCosmetic, CosmeticInventory } from '@/services/cosmeticService'
import { toast } from 'vue-sonner'
export const useCosmeticStore = defineStore('cosmetic', () => {
  // State
  const cosmetics = ref<UserCosmetic[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const cosmeticCount = computed((): number => cosmetics.value.length)

  // Actions
  const fetchCosmetics = async (): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      cosmetics.value = await CosmeticService.user_cosmetic()
    } catch (err: any) {
      error.value = err.message || 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  const equipAvatar = computed(
    () =>
      cosmetics.value.find((cosmetic) => cosmetic.equipped_avatar)?.equipped_avatar?.item ?? null,
  )

  const equipBackground = computed(
    () =>
      cosmetics.value.find((cosmetic) => cosmetic.equipped_background)?.equipped_background?.item ??
      null,
  )

  const setCosmetic = async (backpackItem: CosmeticInventory): Promise<void> => {
    console.log('Setting cosmetic:', backpackItem)

    const type = backpackItem.item.type
    const equipAvatar = cosmetics.value.find(
      (cosmetic) => cosmetic.equipped_avatar,
    )?.equipped_avatar
    const equipBackground = cosmetics.value.find(
      (cosmetic) => cosmetic.equipped_background,
    )?.equipped_background

    let avatar = equipAvatar?.id || 0
    let background = equipBackground?.id || 0
    const isAvatar = type === 'avatar'
    const currentId = isAvatar ? equipAvatar?.id : equipBackground?.id
    const newId = backpackItem.id

    if (currentId === newId) {
      return
    }

    if (isAvatar) {
      avatar = newId
    } else {
      background = newId
    }

    try {
      await CosmeticService.create_cosmetic({
        user: 1,
        equipped_avatar_id: avatar,
        equipped_background_id: background,
      })
      await fetchCosmetics()
      toast_notification()
    } catch (err: any) {
      error.value = err.message || 'Failed to set cosmetic'
    } finally {
      loading.value = false
    }
  }

  const toast_notification = () => {
    toast.success('Inventory has been updated', {
      action: {
        label: 'Close',
        onClick: () => console.log('Closed notification'),
      },
      position: 'top-right',
    })
  }

  const avatarRive = computed(() => equipAvatar.value?.rive_code)

  return {
    cosmetics,
    loading,
    error,
    cosmeticCount,
    fetchCosmetics,
    equipAvatar,
    equipBackground,
    setCosmetic,
    avatarRive,
  }
})
