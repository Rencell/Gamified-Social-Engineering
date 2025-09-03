import { defineStore } from 'pinia'
import { ref } from 'vue'
import { StreakService } from '@/services';
import type { Streak, StreakActivity } from '@/services/streakService';

export const useStreakStore = defineStore('streak', () => {
    // State
    const streakData = ref<Streak | null>(null)
    const openStreakModal = ref(false)
    const data = ref<StreakActivity | null>(null)

    // Actions

    const closeStreakModal = () => {
        openStreakModal.value = false;
    }

    const updateStreak = async () => {
        
        try {
            data.value = await StreakService.get_active_activity();
        } catch (error) {
            console.error('Error updating streak:', error);
        }
    };


    const cacheStreak = async () => {
        if(streakData.value === null){
            await fetchStreak();
        }
    
    };
    const fetchStreak = async () => {
        try {
            const response = await StreakService.get_streak();
            streakData.value = response;
        } catch (error) {
            console.error('Error fetching streak data:', error);
        }
    };

    const postStreak = async () => {
        try {
            const response = await StreakService.update_streak();
            if(streakData.value?.current_streak !== response.current_streak){
                openStreakModal.value = true;
                streakData.value = response;
            }
        }catch (error) {
            console.error('Error posting streak data:', error);
        }
    }

    return {
        data,
        streakData,
        openStreakModal,
        closeStreakModal,
        postStreak,
        updateStreak,
        cacheStreak,
        fetchStreak,
    }
})
