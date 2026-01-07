import { MinigameService } from '@/services'
import type { Minigame } from '@/services/minigameService'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useMiniGameStore = defineStore('MiniGame', () => {


    const minigame = ref<Minigame[]>([])

    const fetchMinigames = async () => {
        if (minigame.value.length > 0) {
            return
        }
        const data = await MinigameService.get_minigame();
        minigame.value = data;
    }

    const updateMinigames = async (minigame: Partial<Minigame>) => {
        try {
            const formData = new FormData()
            if (minigame.name) formData.append('name', minigame.name)
            if (minigame.required_level != null) formData.append('required_level', String(minigame.required_level))
            if (minigame.route_path) formData.append('route_path', minigame.route_path)
            if (minigame.card_color) formData.append('card_color', minigame.card_color)
            
            if(minigame.thumbnail instanceof File) {
                formData.append('thumbnail', minigame.thumbnail)
            }
            await MinigameService.update_minigame(minigame.id as number, formData);
        } catch (error) {
            console.error('Error updating minigame:', error);
        }
    }

    return {
        minigame,
        fetchMinigames,
        updateMinigames
    }
})