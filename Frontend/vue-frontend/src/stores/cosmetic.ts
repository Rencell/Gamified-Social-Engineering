import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CosmeticService } from '@/services'
import type { UserCosmetic, CosmeticInventory, Cosmetic } from '@/services/cosmeticService'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import cosmeticService from '@/services/cosmeticService'
import { playSoundFx, SoundFx } from '@/composables/useSoundFx'
export const useCosmeticStore = defineStore('cosmetic', () => {
  // State
  const authStore = useAuthStore()
  const cosmetics = ref<UserCosmetic[]>([])
  const item_cosmetics = ref<Cosmetic[]>([])
  const inventory_items = ref<CosmeticInventory[]>([])

  // Shop UI state (single source of truth for ShopView)
  const shop_list = ref<(Cosmetic & { purchased: boolean })[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const cosmeticCount = computed((): number => cosmetics.value.length)

  // Actions
  const fetchCosmetics = async (): Promise<void> => {
    if(!cosmetics.value.length) {
      
      await updateService()
    }
  }

  const fetchCosmeticItems = async (): Promise<void> => {
    // Always ensure shop_list matches item_cosmetics.
    // If we've already fetched items, just rebuild shop_list.
    // if (item_cosmetics.value.length) {
    //   shop_list.value = item_cosmetics.value.map((item) => ({ ...item, purchased: false }))
    //   return
    // }

    try {
      item_cosmetics.value = await CosmeticService.get_all()
      shop_list.value = item_cosmetics.value.map((item) => ({ ...item, purchased: false }))
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || 'Failed to fetch cosmetic items'
    }
  }

  const createCosmetic = async (cosmetic: Partial<Cosmetic>) => {
    try {
      loading.value = true
      const formData = new FormData()
      formData.append('name', cosmetic.name!)
      formData.append('type', cosmetic.type!)
      formData.append('price', cosmetic.price!.toString())
      formData.append('rive_code', cosmetic.rive_code!.toString())
      if (cosmetic.image) {
        formData.append('image', cosmetic.image) // actual File object
      }

      const newCosmetics = await cosmeticService.create_item(formData as Partial<Cosmetic>)

      // Keep state in sync
      item_cosmetics.value.push(newCosmetics)
      shop_list.value.push({ ...newCosmetics, purchased: false })
      toast_notification('Cosmetic created successfully')
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  const updateCosmetic = async (cosmetic: Cosmetic) => {
    try {
      const formData = new FormData()
      formData.append('name', cosmetic.name)
      formData.append('type', cosmetic.type)
      formData.append('price', cosmetic.price.toString())
      formData.append('rive_code', cosmetic.rive_code.toString())

      if (cosmetic.image instanceof File) {
        formData.append('image', cosmetic.image)
      }

      const updateCosmetic = await cosmeticService.update_item(cosmetic.id, formData)
      item_cosmetics.value = item_cosmetics.value.map((item) =>
        item.id === updateCosmetic.id ? updateCosmetic : item,
      )
      toast_notification('Cosmetic updated successfully')
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  const deleteCosmetic = async (cosmeticId: number) => {
    try {
      await cosmeticService.delete_item(cosmeticId)

      item_cosmetics.value = item_cosmetics.value.filter((item) => item.id !== cosmeticId)
      shop_list.value = shop_list.value.filter((item) => item.id !== cosmeticId)

      toast_notification('Cosmetic deleted successfully')
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || 'Unknown error'
    } finally {
      loading.value = false
    }
  }
  const updateService = async (): Promise<void> => {
    try {
      cosmetics.value = await CosmeticService.user_cosmetic()
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || 'Unknown error'
    } 
  }

  const fetchInventory = async (): Promise<void> => {
    if(!inventory_items.value.length) {
      await updateInventory()
      
    }
  }

  const updateInventory = async (): Promise<void> => {
    try {
      inventory_items.value = await CosmeticService.get_inventory()
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || 'Failed to update inventory'
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
    const equipAvatar = cosmetics.value.find((cosmetic) => cosmetic.equipped_avatar)?.equipped_avatar
    const equipBackground = cosmetics.value.find((cosmetic) => cosmetic.equipped_background)?.equipped_background

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
        // API typing expects string in this project; normalize to string.
        user: Number(authStore.User?.pk ?? 0),
        equipped_avatar_id: avatar,
        equipped_background_id: background,
      })
      await updateService()
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || 'Failed to set cosmetic'
    } finally {
      loading.value = false
    }
  }
  
  const purchaseCosmetic = async (item: Cosmetic): Promise<void> => {
    try {
      await CosmeticService.create_backpack_item({
        user: String(authStore.User?.pk ?? 0),
        item_id: item.id,
      })
      await updateInventory();
      setCosmetic(inventory_items.value.find(i => i.item.id === item.id)!);

      fetchCosmeticItems();
      toast_notification('You have purchased a cosmetic!')
    } catch (err: unknown) {
      console.error('Error purchasing cosmetic:', err)
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
    playSoundFx(SoundFx.Notification)
  }

  const avatarRive = computed(() => equipAvatar.value?.rive_code)

  const removeFromShopList = (cosmeticId: number) => {
    shop_list.value = shop_list.value.filter((i) => i.id !== cosmeticId)
  }

  return {
    cosmetics,
    shop_list,
    inventory_items,
    item_cosmetics,
    loading,
    error,
    cosmeticCount,
    fetchCosmetics,
    fetchCosmeticItems,
    createCosmetic,
    updateCosmetic,
    deleteCosmetic,
    updateInventory,
    fetchInventory,
    equipAvatar,
    equipBackground,
    setCosmetic,
    avatarRive,
    purchaseCosmetic,
    removeFromShopList,
    toast_notification
  }
})
