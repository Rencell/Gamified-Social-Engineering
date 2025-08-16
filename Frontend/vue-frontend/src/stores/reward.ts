import { defineStore } from "pinia";
import { RewardService } from "@/services";
import { useAuthStore } from "./auth";
import { ref } from "vue";

export const useRewardStore = defineStore('reward', () => {
    const authStore = useAuthStore();

    // State
    const rewardXp = ref();
    const rewardCoin = ref();

    const USER = authStore.User.pk || null

    // Actions
    const action = ref<'increase' | 'decrease'>('increase');

    const updateUserRewards = async (
        act: 'increase' | 'decrease',
        reason: string,
        coin: number,
        xp: number
    ) => {
        try {
            action.value = act;
            const reward = {
                action: act,
                reason: reason || null,
                coin: coin ?? null,
                xp: xp ?? null,
                user: USER,
            };
            const response = await RewardService.create_reward(reward);
            console.log(`Reward ${act}d successfully:`, response);
        } catch (error) {
            console.error(`Failed to ${act} reward:`, error);
        }
    };

    const increaseUserRewards = async (reason: string, coin: number, xp: number) => {
        if (coin < 0)
            return console.error("Cannot increase coin rewards below zero.");
        else
            await updateUserRewards('increase', reason, coin, xp);
    };

    const decreaseUserRewards = async (reason: string, coin: number, xp: number) => {
        if (coin > 0) 
            return console.error("Cannot decrease coin rewards below zero.");
        else
            await updateUserRewards('decrease', reason, coin, xp);
    };

    const purchaseCoinDeduct = async (coin: number) => {
        if (coin > 0) {
            decreaseUserRewards(REASONS.spend, -coin, 0);
        }

    }

    const calculateScore = (score: number, length: number): number => {
        if (score > length || length <= 0) return 0;

        let multiplier = 1;
        if (length <= 3) multiplier = 1.2;
        else if (length <= 5) multiplier = 1.5;

        const baseScore = Math.floor((score / length) * 10);
        return Math.floor(baseScore * multiplier);
    };

    const REASONS = {
        content : 'content',
        quiz    : 'quiz',
        bonus   : 'bonus',
        spend   : 'spend',
        admin   : 'admin',
    };
    
    return {
        rewardXp,
        rewardCoin,
        increaseUserRewards,
        decreaseUserRewards,
        calculateScore,
        REASONS,
        purchaseCoinDeduct,
    }
})
