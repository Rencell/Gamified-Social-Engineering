import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

// Auth store is used for user id during setCosmetic / purchaseCosmetic
const authStoreMock = {
  User: { pk: 7, is_admin: false },
}
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authStoreMock,
}))

// Cosmetic store uses BOTH a named export via @/services and a default import from @/services/cosmeticService
vi.mock('@/services', () => ({
  CosmeticService: {
    user_cosmetic: vi.fn(),
    get_all: vi.fn(),
    get_inventory: vi.fn(),
    create_cosmetic: vi.fn(),
    create_backpack_item: vi.fn(),
  },
}))

vi.mock('@/services/cosmeticService', () => ({
  default: {
    create_item: vi.fn(),
    update_item: vi.fn(),
    delete_item: vi.fn(),
  },
}))

import { toast } from 'vue-sonner'
import { CosmeticService } from '@/services'
import { useCosmeticStore } from '@/stores/cosmetic'
import type { Cosmetic, CosmeticInventory, UserCosmetic } from '@/services/cosmeticService'
import cosmeticService from '@/services/cosmeticService'

describe('Cosmetic store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    authStoreMock.User.pk = 7
  })

  it('fetchCosmetics calls user_cosmetic only when cosmetics is empty', async () => {
    ;(
      CosmeticService.user_cosmetic as unknown as {
        mockResolvedValue: (v: UserCosmetic[]) => void
      }
    ).mockResolvedValue([])

    const store = useCosmeticStore()

    await store.fetchCosmetics()
    expect(CosmeticService.user_cosmetic).toHaveBeenCalledTimes(1)

    await store.fetchCosmetics()
    expect(CosmeticService.user_cosmetic).toHaveBeenCalledTimes(2) // still empty, so still fetches

    // Now seed the cache and ensure no further calls
    store.cosmetics = [{ id: 1 } as unknown as UserCosmetic]
    await store.fetchCosmetics()
    expect(CosmeticService.user_cosmetic).toHaveBeenCalledTimes(2)
  })

  it('fetchCosmeticItems caches result after first load', async () => {
    ;(
      CosmeticService.get_all as unknown as {
        mockResolvedValue: (v: Cosmetic[]) => void
      }
    ).mockResolvedValue([{ id: 1, name: 'Hat', type: 'avatar' } as unknown as Cosmetic])

    const store = useCosmeticStore()
    await store.fetchCosmeticItems()

    expect(CosmeticService.get_all).toHaveBeenCalledTimes(1)
    expect(store.item_cosmetics).toHaveLength(1)

    await store.fetchCosmeticItems()
    expect(CosmeticService.get_all).toHaveBeenCalledTimes(1)
  })

  it('fetchInventory calls get_inventory only when inventory is empty', async () => {
    ;(
      CosmeticService.get_inventory as unknown as {
        mockResolvedValue: (v: CosmeticInventory[]) => void
      }
    ).mockResolvedValue([{ id: 10, item: { id: 1, type: 'avatar' } } as unknown as CosmeticInventory])

    const store = useCosmeticStore()

    await store.fetchInventory()
    expect(CosmeticService.get_inventory).toHaveBeenCalledTimes(1)
    expect(store.inventory_items).toHaveLength(1)

    await store.fetchInventory()
    expect(CosmeticService.get_inventory).toHaveBeenCalledTimes(1)
  })

  it('setCosmetic is a no-op when selecting currently equipped item', async () => {
    const store = useCosmeticStore()

    store.cosmetics = [
      {
        id: 1,
        equipped_avatar: { id: 123, item: { id: 55, type: 'avatar' } },
      } as unknown as UserCosmetic,
    ]

    const backpackItem = { id: 123, item: { id: 55, type: 'avatar' } } as unknown as CosmeticInventory

    await store.setCosmetic(backpackItem)

    expect(CosmeticService.create_cosmetic).not.toHaveBeenCalled()
    expect(CosmeticService.user_cosmetic).not.toHaveBeenCalled()
  })

  it('setCosmetic calls create_cosmetic with correct ids and refreshes cosmetics', async () => {
    ;(
      CosmeticService.create_cosmetic as unknown as {
        mockResolvedValue: (v: unknown) => void
      }
    ).mockResolvedValue({})

    ;(
      CosmeticService.user_cosmetic as unknown as {
        mockResolvedValue: (v: UserCosmetic[]) => void
      }
    ).mockResolvedValue([{ id: 99 } as unknown as UserCosmetic])

    const store = useCosmeticStore()

    // currently equipped background, switching avatar
    store.cosmetics = [
      {
        id: 1,
        equipped_background: { id: 200, item: { id: 2, type: 'background' } },
      } as unknown as UserCosmetic,
    ]

    const newAvatar = { id: 123, item: { id: 1, type: 'avatar' } } as unknown as CosmeticInventory

    await store.setCosmetic(newAvatar)

    expect(CosmeticService.create_cosmetic).toHaveBeenCalledTimes(1)
    expect(CosmeticService.create_cosmetic).toHaveBeenCalledWith({
      user: 7,
      equipped_avatar_id: 123,
      equipped_background_id: 200,
    })

    expect(CosmeticService.user_cosmetic).toHaveBeenCalledTimes(1)
    expect(store.cosmetics).toHaveLength(1)
  })

  it('purchaseCosmetic calls create_backpack_item and shows toast', async () => {
    ;(
      CosmeticService.create_backpack_item as unknown as {
        mockResolvedValue: (v: unknown) => void
      }
    ).mockResolvedValue({})

    const store = useCosmeticStore()

    await store.purchaseCosmetic({ id: 5 } as unknown as Cosmetic)

    expect(CosmeticService.create_backpack_item).toHaveBeenCalledWith({
      user: 7,
      item_id: 5,
    })

    expect(toast.success).toHaveBeenCalled()
  })

  it('createCosmetic uses cosmeticService.create_item and pushes into item_cosmetics', async () => {
    ;(
      cosmeticService.create_item as unknown as {
        mockResolvedValue: (v: Cosmetic) => void
      }
    ).mockResolvedValue({ id: 1, name: 'New', type: 'avatar' } as unknown as Cosmetic)

    const store = useCosmeticStore()
    await store.createCosmetic({
      name: 'New',
      type: 'avatar',
      price: 10,
      rive_code: 1,
    } as unknown as Partial<Cosmetic>)

    expect(cosmeticService.create_item).toHaveBeenCalledTimes(1)
    expect(store.item_cosmetics).toHaveLength(1)
  })

  it('updateCosmetic uses cosmeticService.update_item, updates item_cosmetics, and shows toast', async () => {
    ;(
      cosmeticService.update_item as unknown as {
        mockResolvedValue: (v: Cosmetic) => void
      }
    ).mockResolvedValue({ id: 2, name: 'Updated', type: 'avatar', price: 1, rive_code: 1 } as unknown as Cosmetic)

    const store = useCosmeticStore()
    store.item_cosmetics = [
      { id: 2, name: 'Old', type: 'avatar', price: 1, rive_code: 1 } as unknown as Cosmetic,
      { id: 3, name: 'Other', type: 'avatar', price: 1, rive_code: 1 } as unknown as Cosmetic,
    ]

    await store.updateCosmetic({ id: 2, name: 'Updated', type: 'avatar', price: 1, rive_code: 1 } as unknown as Cosmetic)

    expect(cosmeticService.update_item).toHaveBeenCalledTimes(1)
    expect(store.item_cosmetics.find((c) => c.id === 2)?.name).toBe('Updated')
    expect(toast.success).toHaveBeenCalled()
  })

  it('deleteCosmetic uses cosmeticService.delete_item, removes from item_cosmetics, and shows toast', async () => {
    ;(
      cosmeticService.delete_item as unknown as {
        mockResolvedValue: (v: unknown) => void
      }
    ).mockResolvedValue({})

    const store = useCosmeticStore()
    store.item_cosmetics = [
      { id: 1, name: 'A', type: 'avatar', price: 1, rive_code: 1 } as unknown as Cosmetic,
      { id: 2, name: 'B', type: 'avatar', price: 1, rive_code: 1 } as unknown as Cosmetic,
    ]

    await store.deleteCosmetic(1)

    expect(cosmeticService.delete_item).toHaveBeenCalledWith(1)
    expect(store.item_cosmetics.map((c) => c.id)).toEqual([2])
    expect(toast.success).toHaveBeenCalled()
  })
})
