<script setup lang="ts">
import { ref, watch } from 'vue';
import { useLevelStore } from '@/stores/level';

import { useCosmeticStore } from '@/stores/cosmetic';
import RivePlayer from '@/components/RivePlayer.vue';
import Spinner from '@/components/ui/spinner/spinner.vue'
import trophy from '/Icons/Trophy.svg?url'
import { useStreakStore } from '@/stores/pageStreak';
import fire from '/Learning/fire.svg';
import type { Authentication } from '@/services/authService';
const levelStore = useLevelStore();
const cosmeticStore = useCosmeticStore();

cosmeticStore.fetchCosmetics()

const loading = ref(true)
const loadedImage = ref<string>('')


// Watch whenever S3 background changes
watch(
    () => cosmeticStore.equipBackground?.image || '/background-repeat.jpg',
    (newImage) => {
        if (!newImage) return

        loading.value = true

        const img = new Image()
        img.src = String(newImage)

        // Wait for S3 image to fully load
        img.onload = () => {
            loadedImage.value = String(newImage)
            loading.value = false
        }

        img.onerror = () => {
            // fallback if S3 fails
            loadedImage.value = ''
            loading.value = false
        }
    },
    { immediate: true }
)

defineProps<{
    currentUser: Authentication
}>()


const streakStore = useStreakStore();
streakStore.cacheStreak();
</script>


<template>

    <RouterLink :to="{ name: 'Profile' }" class="cursor-pointer">
        <div class="w-full h-50 md:h-70 bg-secondary rounded-lg flex flex-col">
            <div class="w-full bg-secondary h-2/3 bg-contain bg-repeat rounded-t-lg relative flex-2"
                :style="{ backgroundImage: `url(${loadedImage})` }">
                <div v-if="loading" class="flex justify-center items-center h-full">
                    <Spinner />
                </div>
                <div class="absolute inset-0 bg-black/30 rounded-t-lg"></div>

                <div
                    class="absolute sm:left-15 left-5 top-1/2 -translate-y-1/2 font-display font-bold flex flex-col text-white">
                    <div class="text-lg sm:text-2xl font-bold">Hi there!</div>
                    <p class="text-3xl sm:text-5xl font-extrabold capitalize">{{ currentUser.username }}</p>

                </div>
                <div class="absolute right-5 sm:right-15 top-1/2 -translate-y-1/2 sm:translate-y-0">
                    <div
                        class="overflow-hidden relative size-23 md:size-30 bg-slate-300/70 border-slate-200 border-5 rounded-full flex items-center justify-center">
                        <div class="w-24 sm:w-35 absolute">
                            <RivePlayer :position-state="1" />
                        </div>

                    </div>
                    <img :src="levelStore.currentBadge.image"
                        class="absolute -bottom-1 -right-1 w-10 h-10 md:w-15 md:h-15 z-10" alt="">
                </div>
            </div>
            <div
                class="flex-1 flex flex-row-reverse rounded-b-lg px-2 justify-end items-center relative gap-4 mx-0 sm:mx-15 ">

                <RouterLink :to="{ name: 'Leaderboard' }" class="bg-ternary/30 rounded-lg px-4 py-1 text-center w-fit flex items-center gap-2 hover:scale-110 hover:transition-transform hover:duration-300 ">
                    <img :src="trophy" class="size-6 mx-auto" alt="">
                    <div>
                        <p class="font-display font-bold text-lg sm:text-xl">
                            #{{ currentUser.rank || 0 }}
                        </p>
                        <p class="text-xs text-yellow-300 hidden sm:block">
                            Rank
                        </p>
                    </div>
                </RouterLink>
                <div class="bg-ternary/30 rounded-lg px-4 py-1 text-center w-fit flex items-center gap-2 hover:scale-110 hover:transition-transform hover:duration-300">
                    <img :src="fire" class="size-6 mx-auto" alt="">
                    <div>
                        <p class="font-display font-bold text-lg sm:text-xl">
                            {{ streakStore.streakData?.current_streak || 0 }}
                        </p>
                        <p class="text-xs text-ternary brightness-125 hidden sm:block">
                            Streak
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </RouterLink>
</template>