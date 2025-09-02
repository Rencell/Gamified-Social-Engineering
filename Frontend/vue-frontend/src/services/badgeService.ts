import session from './api'

export interface Badge {
  name: string
  lesson: number
}

export interface UserBadge{
    user: number
    badge: Badge

}
const END_POINT = '/api/badges/'
const USER_END_POINT = '/api/badges/user-badge/'

const badgeService = {
  get_all: (): Promise<Badge[]> => session.get(END_POINT + 'badge/').then((res) => res.data),
  create: (badge_id: number): Promise<unknown> => session.post(USER_END_POINT,  { badge_id }).then((res) => res.data),
  get_user_badge: (): Promise<UserBadge[]> => session.get(USER_END_POINT + 'unlocked/').then((res) => res.data),

}

export default badgeService
