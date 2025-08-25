<script setup lang="ts">
import exp from '/Home/exp.png';
import { computed, ref, watch } from 'vue';
import { useLevelStore } from '@/stores/level';

import { useCosmeticStore } from '@/stores/cosmetic';
import RivePlayer from '@/components/RivePlayer.vue';
import Spinner from '@/components/ui/spinner/spinner.vue'
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
</script>


<template>
    <RouterLink :to="{ name: 'Profile' }" class="cursor-pointer">
        <div class="w-full h-72 bg-secondary rounded-lg flex flex-col">
            <div class="w-full bg-secondary h-2/3 bg-contain bg-repeat rounded-t-lg"
                :style="{ backgroundImage: `url(${loadedImage})` }">
                <div v-if="loading" class="flex justify-center items-center h-full">
                    <Spinner />
                </div>
            </div>
            <div class="flex rounded-b-lg justify-evenly items-center">

                <div class="space-y-2 text-center ">
                    <div class="w-full flex justify-center items-center">
                        <img :src="levelStore.currentBadge.image" class="w-15 h-15" alt="">
                    </div>
                    <div class="relative flex items-center">
                        <div class="rounded-full h-5 w-30 bg-ternary/50 ">
                            <div class="w-20 bg-purple-500 h-full rounded-full flex items-center pl-10 text-xs relative">
                                <div
                                    class="absolute top-1 -left-1 h-1.5 bg-purple-500 brightness-125 rounded-full"
                                    :style="{ width: 'calc(100% - 3px)' }"
                                >
                                </div>
                            </div>
                        </div>
                        <img class="h-8 w-8 absolute -left-3" :src="exp" alt="">
                    </div>
                </div>
                <div
                    class="overflow-hidden relative bottom-10 w-30 h-30 bg-black border-secondary border-5 rounded-full flex items-center justify-center">
                    <div class="w-50 absolute -bottom-20">
                        <RivePlayer />
                    </div>

                </div>
                <div class="rounded-full h-6 w-30">

                </div>

            </div>
        </div>
    </RouterLink>
</template>