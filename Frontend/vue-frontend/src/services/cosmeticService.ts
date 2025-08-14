import session from './api'

export interface Cosmetic {
  name: string
  type: string
  image: string
  price: number
  rive_code: number
}

export interface CosmeticInventory {
  id: number
  User: string
  item: Cosmetic
  acquired_at: string
}

export interface UserCosmetic {
  equipped_avatar: CosmeticInventory
  equipped_background: CosmeticInventory
}

export interface createUserCosmetic {
  user: number
  equipped_avatar_id: number
  equipped_background_id: number
}

const END_POINT = '/api/cosmetics/'

const cosmeticService = {
  get_all: (): Promise<Cosmetic[]> => session.get(END_POINT + 'item/').then((res) => res.data),
  get_inventory: (): Promise<CosmeticInventory[]> =>
    session.get(END_POINT + 'backpack-item/').then((res) => res.data),
  user_cosmetic: (): Promise<UserCosmetic[]> =>
    session.get(END_POINT + 'user-cosmetics/').then((res) => res.data),
  create_cosmetic: (cosmetic: createUserCosmetic): Promise<createUserCosmetic> =>
    session.post(END_POINT + 'user-cosmetics/',  cosmetic ).then((res) => res.data),
}

export default cosmeticService
