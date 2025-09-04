<template>
    <RouterLink :to="{ name: 'MiniGames' }">
        <div class="flex gap-2 mb-5 text-sm items-center text-accent font-bold">
            <ArrowLeft :size="15"></ArrowLeft> Back
        </div>
    </RouterLink>
    <component class="border-7 border-ternary" :is="game"></component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import RocketGame from '@/components/MiniGames/Rocket/rocketGame.vue';
import GuessWord from '@/components/MiniGames/GuessWord/guessWord.vue';
import Whack from '@/components/MiniGames/WhackaMole/game.vue';
import Error from '@/components/MiniGames/errorPage.vue'
import { ArrowLeft } from 'lucide-vue-next';

const route = useRoute()
const gameId = route.params.gameId as string;

const game  = computed(() => {
    if (gameId === 'rocket') {
        return RocketGame
    }else if (gameId === 'guessWord') {
        return GuessWord
    }
    else if (gameId === 'whack') {
        return Whack
    }
    return Error
})

</script>