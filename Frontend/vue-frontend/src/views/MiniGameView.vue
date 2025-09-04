<template>
    <div class="h-fit">
        <p class="font-bold text-3xl mb-4">Mini Games</p>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-14 md:gap-4">
            <template v-for="game in games" :key="game.id">
                <RouterLink v-if="!game.locked" :to="{ name: 'MiniGamesDetail', params: { gameId: game.id } }"
                    :class="[game.cardClass]"
                    class="relative h-70 rounded-2xl p-5 hover:scale-105 transition-transform duration-300 ease-in-out">
                    <div class="relative">
                        <p class="pb-4 text-xl font-bold">{{ game.name }}</p>
                        <div class="h-1 w-10 bg-white absolute bottom-0"></div>
                    </div>

                    <div class=" h-full flex items-center justify-center">
                        <img :src="game.image" class="h-full size-40" :alt="`${game.name} Thumbnail`">
                    </div>
                    <div class="h-10 w-30 rounded-full bg-accent absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-white font-bold shadow-lg hover:bg-accent-dark cursor-pointer"
                        :class="game.locked ? 'bg-secondary cursor-not-allowed' : ''">
                        <Play class="fill-white size-4 me-2"></Play>
                        {{ game.locked ? 'Locked' : 'Play' }}
                    </div>
                </RouterLink>
                <div v-else :class="[game.cardClass, 'bg-secondary cursor-not-allowed']"
                    class="relative h-70 rounded-2xl p-5" aria-disabled="true">
                    <div class="relative">
                        <p class="pb-4 text-xl font-bold">{{ game.name }}</p>
                        <div class="h-1 w-10 bg-white absolute bottom-0"></div>
                    </div>

                    <div>
                        <img :src="game.image" :alt="`${game.name} Thumbnail`">
                    </div>
                    <div
                        class="h-10 w-30 rounded-full bg-ternary absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-white font-bold shadow-lg cursor-not-allowed">
                        <Lock class="size-4 me-2"></Lock>
                        Locked
                    </div>
                </div>
            </template>
        </div>
    </div>

</template>

<script setup lang="ts">
import rocket from '/MiniGames/Rocket.svg';
import guessWord from '/MiniGames/GuessWord.svg';
import { Lock, Play } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import Whack from '@/components/MiniGames/WhackaMole/whack.vue'
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import Game from '@/components/MiniGames/WhackaMole/game.vue'
import faceImage from '/MiniGames/mole.svg';


const games = [
    {
        id: 'rocket',
        name: 'Rocket Password',
        image: rocket,
        cardClass: 'bg-[#131c30]',
        locked: false,
    },
    {
        id: 'guessWord',
        name: 'Guess Word',
        image: guessWord,
        cardClass: 'bg-[#75bd3d]',
        locked: false,
    },
    {
        id: 'whack',
        name: 'Whack a Mole',
        image: faceImage,
        cardClass: 'bg-[#f6c298]',
        locked: false,
    },
    {
        id: 'crossPuzzle',
        name: 'Cross Puzzle',
        image: guessWord,
        cardClass: 'bg-[#75bd3d]',
        locked: true,
    },
];
</script>
