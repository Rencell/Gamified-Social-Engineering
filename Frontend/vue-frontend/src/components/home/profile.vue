<script setup lang="ts">
import exp from '/Home/exp.png';
import { computed, ref, watch } from 'vue';
import { useLevelStore } from '@/stores/level';

import { useCosmeticStore } from '@/stores/cosmetic';
import RivePlayer from '@/components/RivePlayer.vue';
import Spinner from '@/components/ui/spinner/spinner.vue'
import { Progress } from '../ui/progress';
import { useStreakStore } from '@/stores/pageStreak';
import fire from '/Learning/fire.svg';
const levelStore = useLevelStore();
const cosmeticStore = useCosmeticStore();

cosmeticStore.fetchCosmetics()

const loading = ref(true)
const loadedImage = ref<string>('')

// Watch whenever S3 background changes
watch(
    () => cosmeticStore.equipBackground?.image,
    (newImage) => {
        if (!newImage) return

        loading.value = true

        const img = new Image()
        img.src = newImage

        // Wait for S3 image to fully load
        img.onload = () => {
            loadedImage.value = newImage
            loading.value = false
        }

        img.onerror = () => {
            // fallback if S3 fails
            loading.value = false
        }
    },
    { immediate: true }
)

const streakStore = useStreakStore();
streakStore.cacheStreak();
</script>


<template>
    <RouterLink :to="{ name: 'Profile' }" class="cursor-pointer">
        <div class="w-full h-50 md:h-70 bg-secondary rounded-lg flex flex-col">
            <div class="w-full bg-secondary h-2/3 bg-contain bg-repeat rounded-t-lg"
                :style="{ backgroundImage: `url(${loadedImage})` }">
                <div v-if="loading" class="flex justify-center items-center h-full">
                    <Spinner />
                </div>
            </div>
            <div class="flex flex-row-reverse md:flex-row rounded-b-lg px-2 justify-between md:justify-evenly items-center relative gap-4">

                <div class="space-y-2 text-center flex flex-row sm:flex-col flex-1 md:flex-none">
                    <div class="w-fit md:w-full flex justify-center items-center absolute md:static bottom-0 left-9 z-30">
                        <img :src="levelStore.currentBadge.image" class="w-10 md:w-15 h-10 md:h-15" alt="">
                    </div>
                    <div class="relative flex items-center flex-1">
                        <div class="rounded-full h-5 w-full md:w-30 bg-ternary/50 ">
                            <Progress :model-value="20" bg="bg-orange-500" bg-background="bg-background"></Progress>
                        </div>
                        <img class="h-8 w-8 absolute -left-3" :src="exp" alt="">
                    </div>
                </div>
                <div
                    class="overflow-hidden relative bottom-5 size-25 md:size-30 bg-black border-secondary border-5 rounded-full flex items-center justify-center">
                    <div class="w-35 sm:w-50 absolute -bottom-12 sm:-bottom-20">
                        <RivePlayer />
                    </div>

                </div>
                <div class="rounded-full h-6 w-fit hidden sm:flex items-center gap-2">
                    <img :src="fire" class="size-13" alt="">
                    <div class="flex flex-col">
                        <p class="text-3xl font-bold font-display">{{streakStore.streakData?.current_streak || 0}} </p>
                        <div class="text-sm font-semibold text-ternary brightness-125">Day Streak</div>
                    </div>
                    
                </div>

            </div>
        </div>
    </RouterLink>
</template>