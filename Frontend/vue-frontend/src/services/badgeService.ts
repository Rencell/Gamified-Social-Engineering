import session from './api'

export interface Badge {
  id: number
  name: string
  code?: string
  description: string
  image: string
  is_active?: boolean
  has_rule?: boolean
  rule?: BadgeRule
  lesson?: number
  
}

export interface BadgeRule {
  badge_id: number
  type: 'streak' | 'completion' | 'count'
  target_value: number
  target_entity: 'login' | 'lesson' | 'module' | 'quiz'
  target_entity_id?: number | null
}

export interface UserBadge {
  user: number
  badge: Badge
  completed_at?: string
}

const END_POINT = '/api/badges/'
const USER_END_POINT = '/api/badges/user-badge/'

const badgeService = {
  // public
  get_all: (): Promise<Badge[]> => session.get(END_POINT + 'badge/').then((res) => res.data),

  // user claim/unlocked
  create: (badge_id: number): Promise<unknown> =>
    session.post(USER_END_POINT, { badge_id }).then((res) => res.data),
  get_user_badge: (): Promise<UserBadge[]> => session.get(USER_END_POINT + 'unlocked/').then((res) => res.data),
  get_badge_claimable: (): Promise<Badge[]> => session.get(USER_END_POINT + 'claimable/').then((res) => res.data),

  // admin: create badge
  admin_create_badge: (payload: FormData): Promise<Badge> =>
    session.post(END_POINT + 'badge/', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data),

  // admin: update badge
  admin_update_badge: (badge_id: number, payload: FormData): Promise<Badge> =>
    session.patch(END_POINT + `badge/${badge_id}/`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data),

  // admin: create rule
  admin_create_rule: (payload: BadgeRule): Promise<BadgeRule> =>
    session.post(END_POINT + 'badge-rule/', payload).then((res) => res.data),
  admin_update_rule: (rule_id: number, payload: BadgeRule): Promise<BadgeRule> =>
    session.patch(END_POINT + `badge-rule/${rule_id}/`, payload).then((res) => res.data),
  // badge rule (read)
  get_badge_rule: (badge_id: number): Promise<BadgeRule | null> =>
    session.get(END_POINT + `badge/${badge_id}/rule/`).then((res) => res.data),
}

export default badgeService
