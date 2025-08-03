import session from './api';

export interface Reward {
    action: string | null;
    reason: string | null;
    coin: number | null;
    xp: number | null;
    user: number | null;
}

const END_POINT = "/api/rewards/";

const rewardService = {
  create_reward: (reward: Reward): Promise<Reward> =>
    session.post(END_POINT + 'rewardlog/', reward).then(res => res.data),
  user_stats: (user_id: number): Promise<any> =>
    session.get(END_POINT + 'userstats/by_user/', { params: { user_id } }).then(res => res.data),
  
};

export default rewardService;