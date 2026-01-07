import { defineStore } from "pinia";
import { RewardService } from "@/services";
import { useAuthStore } from "./auth";
import { ref, computed } from "vue";

export const useRewardStore = defineStore('reward', () => {
    const authStore = useAuthStore();

    // State
    const rewardXp = ref<number | undefined>();
    const rewardCoin = ref<number | undefined>();

    // Keep user id in sync with auth store
    const USER = computed(() => authStore.User?.pk ?? null)

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
                user: USER.value,
            };
            const response = await RewardService.create_reward(reward);
            authStore.User.coin += coin;
            authStore.User.exp += xp;
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
            // Await so callers/tests can reliably observe side effects
            await decreaseUserRewards(REASONS.spend, -coin, 0);
        }
    }

    // ------------- REWARDING -------------
    const calculateScore = (score: number, length: number): { coin: number, exp: number } => {
        if (score > length || length <= 0) return { coin: 0, exp: 0 };

        let multiplier = 1;
        if (length <= 3) multiplier = 1.2;
        else if (length <= 5) multiplier = 1.5;

        const baseScore = Math.floor((score / length) * 10);
        const adjustedScore = Math.floor(baseScore * multiplier);

        return {
            coin: adjustedScore * 2, // Example: coins are double the score
            exp: adjustedScore * 4, // Example: experience is quadruple the score
        };
    };

    const rewardByModule = (moduleIndex: number) => {
        const coins = moduleIndex * 2
        const xp = moduleIndex * 4

        // updateUserRewards already mutates authStore.User.*; don't double-add here
        increaseUserRewards(REASONS.content, coins, xp)
    }

    const REASONS = {
        content     : 'content',
        quiz        : 'quiz',
        bonus       : 'bonus',
        spend       : 'spend',
        assessment  : 'assessment',
        admin       : 'admin',
    };
    
    return {
        rewardXp,
        rewardCoin,
        increaseUserRewards,
        decreaseUserRewards,
        calculateScore,
        rewardByModule,
        REASONS,
        purchaseCoinDeduct,
    }
})
