<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import home from '/Home/avatar.svg';
import robot from '/Home/robot.svg';
import { ArrowLeft } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import badge from '/Home/badge.svg';
import { Button } from '@/components/ui/button';
import exp from '/Home/exp.png';
import rank from '/Home/rank.webp';
import { useLevelStore } from '@/stores/level';
import RivePlayer from '@/components/RivePlayer.vue'
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
const authStore = useAuthStore();
const levelStore = useLevelStore();


const currentXP = authStore.User?.exp || 0
const currentLevelXP = computed(() => {
    if(levelStore.previousLevel.xp_required === levelStore.currentSelectedLevel?.xp_required){
        return 0
    }
    return levelStore.previousLevel?.xp_required || 0
})
    
const nextLevelXP = levelStore.currentSelectedLevel?.xp_required || 0

const progressPercentage = ((currentXP - currentLevelXP.value) / (nextLevelXP - currentLevelXP.value)) * 100
const xpToNext = nextLevelXP - currentXP

</script>

<template>
    <RouterLink :to="{ name: 'Home' }">
        <div class="flex gap-2 mb-5 text-sm items-center text-accent -mt-3">
            <ArrowLeft :size="15"></ArrowLeft> 
            <p class="font-semibold w-fit">Back</p>
        </div>
    </RouterLink>
    <div class="grid grid-cols-1 grid-rows-2 sm:grid-cols-3 sm:grid-rows-2 gap-4 min-h-[85dvh] p-5 sm:p-0">
        <div class="row-span-2 col-span-2 sm:row-span-2 sm:col-span-1 flex flex-1">
            <Card class="flex-1 h-full">
                <CardContent class="flex justify-center items-center h-full flex-col">
                    <p class="italic font-bold text-3xl text-center">{{ authStore.User.username.toUpperCase() }}</p>
                    <RivePlayer />
                    <RouterLink :to="{name: 'Inventory'}" class="font-bold text-accent">Change Avatar</RouterLink>
                </CardContent>
            </Card>
        </div>
        <div class="col-span-2 sm:col-start-2 flex flex-1">
            <Card class="flex-1">
                <CardContent class="px-5 sm:px-10">
                    <!-- Header -->
                    <p class="font-bold mb-0 sm:mb-6 text-xl">Exp Points</p>

                    <!-- Level Progression -->
                    <div class="flex items-center justify-between h-full">
                        <!-- Current Level -->
                        <div class="flex flex-col items-center">
                            <div>
                                <img :src="levelStore.currentBadge.image" class="w-20 h-20" alt="">
                            </div>
                            <div class="flex items-center mt-4 gap-1">
                                <img :src="exp" class="w-8 h-8" alt="">
                                <span class="text-lg font-bold">{{ currentXP.toLocaleString() }}</span>
                            </div>
                        </div>

                        <!-- Progress Bar -->
                        <div class="flex-1 mx-10">
                            <div class="relative">
                                <div class="w-full h-3 bg-ternary rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-yellow-400 to-yellow-700 rounded-full transition-all duration-500"
                                        :style="{ width: `${progressPercentage}%` }" />
                                </div>
                            </div>
                            <p class="text-slate-400 text-center mt-6 text-xs font-semibold italic">
                                Earn <span class="text-yellow-500">{{ xpToNext }}</span> xp to reach next level.</p>
                        </div>

                        <!-- Next Level -->
                        <div class="flex flex-col items-center">
                            <!-- Shield Shape -->
                            <div>
                                <img :src="levelStore.nextBadge.image" class="w-20 h-20" alt="">
                            </div>
                            <div class="flex items-center mt-4 gap-1">
                                <img :src="exp" class="w-8 h-8" alt="">
                                <span class="text-lg font-bold">{{ nextLevelXP.toLocaleString() }}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div class="col-span-2 sm:col-start-2 flex flex-1">
            <Card class="flex-1">
                <CardContent class="px-10">
                    <div class="flex justify-between">
                        <p class="font-bold mb-6 text-xl">Badges</p>
                        <RouterLink :to="{ name: 'Badges' }">

                            <Button aschild>
                                See All
                            </Button>

                        </RouterLink>
                    </div>
                    <div class="grid grid-cols-5 gap-2">
                        <img :src="badge" class="w-20 h-20" alt="">
                        <img :src="badge" class="w-20 h-20" alt="">
                        <img :src="badge" class="w-20 h-20" alt="">
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>


</template>