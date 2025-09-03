import session from './api'
export interface Streak {
    current_streak: number | null
    longest_streak: number | null
    last_activity_date: string | null
    streak_start_date: string | null
    user_id: number | null
}

export interface StreakActivity {
    active_days: string[]
}

const END_POINT = '/api/streak/user-streak/'
const END_POINT_ACTIVITY = '/api/streak/activity/active_days/'

const streakService = {
    update_streak: (): Promise<Streak> =>
        session.post(END_POINT + 'get_streak/').then((res) => res.data),
    get_streak: (): Promise<Streak> => 
        session.get(END_POINT + 'view_streak/').then((res) => res.data),
    get_active_activity: (): Promise<StreakActivity> => 
        session.get(END_POINT_ACTIVITY).then((res) => res.data as StreakActivity),

    
}
  

export default streakService
