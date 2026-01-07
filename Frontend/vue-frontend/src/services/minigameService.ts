import session from './api'

export interface Minigame {
    id: number
    name: string
    required_level: number | null
    route_path: string
    thumbnail: File | string | null
    card_color: string
    is_daily: boolean
}

const END_POINT = '/api/minigames/'

const minigameService = {
  get_minigame: (): Promise<Minigame[]> =>
    session.get(END_POINT + 'minigame/').then((res) => res.data as Minigame[]),

  get_minigame_by_id: (id: number): Promise<Minigame> =>
    session.get(END_POINT + 'minigame/' + id + '/').then((res) => res.data as Minigame),

  update_minigame: (id: number, minigameData: FormData): Promise<Minigame> =>
    session.patch(END_POINT + 'minigame/' + id + '/', minigameData).then((res) => res.data as Minigame)
  
}

export default minigameService
