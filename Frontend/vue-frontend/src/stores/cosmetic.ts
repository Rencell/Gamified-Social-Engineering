import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CosmeticService } from '@/services'
import type { UserCosmetic, CosmeticInventory, Cosmetic } from '@/services/cosmeticService'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
export const useCosmeticStore = defineStore('cosmetic', () => {
  // State
  const authStore = useAuthStore()
  const cosmetics = ref<UserCosmetic[]>([])
  const inventory_items = ref<CosmeticInventory[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const cosmeticCount = computed((): number => cosmetics.value.length)

  // Actions
  const fetchCosmetics = async (): Promise<void> => {
    if(!cosmetics.value.length) {
      updateService()
    }
  }

  const updateService = async (): Promise<void> => {
    try {
      cosmetics.value = await CosmeticService.user_cosmetic()
    } catch (err: any) {
      error.value = err.message || 'Unknown error'
    } 
  }

  const fetchInventory = async (): Promise<void> => {
    if(!inventory_items.value.length) {
      await updateInventory()
      
    }
  }

  const updateInventory = async (): Promise<void> => {
    try {
      inventory_items.value = await CosmeticService.get_inventory();
    } catch (err: any) {
      error.value = err.message || 'Failed to update inventory'
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
    console.log('Setting avatar:', avatar)
    try {
      await CosmeticService.create_cosmetic({
        user: authStore.User?.pk || 0,
        equipped_avatar_id: avatar,
        equipped_background_id: background,
      })
      await updateService()
      toast_notification('Inventory has been updated')
    } catch (err: any) {
      error.value = err.message || 'Failed to set cosmetic'
    } finally {
      loading.value = false
    }
  }
  
  const purchaseCosmetic = async (item: Cosmetic): Promise<void> => {
    try{
      await CosmeticService.create_backpack_item({
        user: authStore.User?.pk || 0,
        item_id: item.id,
      })
      toast_notification('You have purchased a cosmetic!')
    }catch (error) {
      console.error('Error purchasing cosmetic:', error)
    }
  }

  const toast_notification = (message: string) => {
    toast.success(message, {
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
    inventory_items,
    loading,
    error,
    cosmeticCount,
    fetchCosmetics,
    fetchInventory,
    equipAvatar,
    equipBackground,
    setCosmetic,
    avatarRive,
    purchaseCosmetic
  }
})
