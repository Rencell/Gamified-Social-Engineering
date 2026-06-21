<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Check, Clock, Flame, Shield } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import fire from '/Learning/fire.svg';
import { useLevelStore } from '@/stores/level';
import RivePlayer from '@/components/RivePlayer.vue'
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { Progress } from '@/components/ui/progress';
import { useBadgesStore } from '@/stores/badges';
import Defence from '@/components/home/dialog/defence.vue'
import { playSoundFx, SoundFx } from '@/composables/useSoundFx';
import { useStreakStore } from '@/stores/pageStreak';
const badgeStore = useBadgesStore();
const authStore = useAuthStore();
const levelStore = useLevelStore();


const currentXP = authStore.User?.exp || 0
const currentLevelXP = computed(() => {
    if (levelStore.previousLevel.xp_required === levelStore.currentSelectedLevel?.xp_required) {
        return 0
    }
    return levelStore.previousLevel?.xp_required || 0
})

const nextLevelXP = levelStore.currentSelectedLevel?.xp_required || 0

const progressPercentage = ((currentXP - currentLevelXP.value) / (nextLevelXP - currentLevelXP.value)) * 100
const xpToNext = nextLevelXP - currentXP
const streakStore = useStreakStore();
onMounted(() => {
    badgeStore.fetchBadges();
    streakStore.cacheStreak();
});

</script>

<template>
    <RouterLink :to="{ name: 'Home' }">
        <div class="flex gap-2 mb-5 text-sm items-center text-accent -mt-3" @click="playSoundFx(SoundFx.Button)">
            <ArrowLeft :size="15"></ArrowLeft>
            <p class="font-semibold w-fit">Back</p>
        </div>
    </RouterLink>
    <div class="grid grid-cols-1 grid-rows-2 sm:grid-cols-3 sm:grid-rows-2 gap-4 min-h-[85dvh] sm:p-0 mb-20 sm:mb-0">
        <div class="row-span-2 col-span-2 sm:row-span-2 sm:col-span-1 flex flex-col gap-3 flex-1">
            <Card class="= h-full">
                <div class="ms-5 animate-pulse">
                    <Defence class=""/>
                </div>
                <CardContent class="flex justify-center items-center h-full flex-col">
                    <RivePlayer />
                    <RouterLink :to="{ name: 'Inventory' }" class="font-bold text-accent">Change Avatar</RouterLink>
                </CardContent>
            </Card>
            
            <div class="grid grid-cols-2 gap-4 text-xs sm:text-sm font-semibold font-display">
                <Card class="p-3 gap-1 px-5">
                    <p class="mb-0">Defence Score</p>
                    <p class="text-2xl">100%</p>
                </Card>
                <Card class="p-3 gap-1">
                    <p>Longest Streak</p>
                    <div class="text-2xl flex items-center gap-2">
                        <p>{{streakStore.streakData?.longest_streak}}</p> 
                        <img
                            :src="fire"
                            class="w-5"
                        />
                    </div>
                </Card>
            </div>
        </div>
        <div class="col-span-2 sm:col-start-2 flex flex-1">
            <Card class="flex-1">
                <CardContent class="px-5 sm:px-10 pb-6 sm:pb-0">
                    <!-- Header -->
                    <div class="flex justify-between items-center mb-6">
                        <p class="font-bold mb-0 sm:mb-6 text-sm sm:text-xl">Level Path</p>

                        <p class="font-bold mb-0 sm:mb-6 text-xs">Current Exp: <span class="text-yellow-500">{{
                                currentXP }}</span></p>
                    </div>
                    <!-- Level Progression -->
                    <div class="flex items-center justify-between h-full sm:px-10 ">
                        <!-- Current Level -->
                        <div class="flex flex-col items-center font-semibold">
                            
                            <img :src="levelStore.currentBadge.image" class="w-15 h-15 sm:w-20 sm:h-20" alt="">
                            <p class="text-xs">Current</p>
                            
                        </div>

                        <!-- Progress Bar -->
                        <div class="flex-1 mx-5 sm:mx-10 space-y-5">
                            <p class="text-slate-400 text-center mt-6 text-xs font-semibold italic sm:block hidden">
                                Earn <span class="text-yellow-500">{{ xpToNext }}</span> xp to reach next level.</p>
                            <div class="relative">
                                <Progress :model-value="progressPercentage" bg="bg-purple-500"
                                    bg-background="bg-ternary/70"></Progress>
                            </div>
                        
                        </div>

                        <!-- Next Level -->
                        <div class="flex flex-col items-center font-semibold">
                            <!-- Shield Shape -->
                            <img :src="levelStore.nextBadge.image" class="w-15 h-15 sm:w-20 sm:h-20" alt="">
                            <p class="text-xs">Next Level</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div class="col-span-2 sm:col-start-2 flex flex-1">
            <Card class="flex-1 bg-transparent">
                <CardContent class="px-0">
                    <div class="flex justify-between px-6">
                        <p class="font-bold mb-6 text-sm">Recent Achievements</p>
                        <RouterLink :to="{ name: 'Badges' }">

                            <Button aschild variant="outline">
                                See All
                            </Button>

                        </RouterLink>
                    </div>
                    <div class="space-y-2">
                    <div
                        v-for="(badge, index) in badgeStore.badgesUnlocked"
                        :key="index"
                        class="flex items-center gap-3 rounded-lg bg-secondary p-3 transition-all text-primary"
                    >
                        <!-- Badge Icon -->
                        <div class="flex h-15 w-15 items-center justify-center rounded-lg bg-background backdrop-blur-md border-1 shadow-md ">
                        <img 
                            :src="badge.badge.image" 
                            class="h-10 w-10 object-contain"
                            :alt="badge.badge.name ?? 'badge'"
                        />
                        </div>

                        <!-- Badge Details -->
                        <div class="flex-1">
                            <p class="font-semibold">{{ badge.badge.name }}</p>
                            <p class="text-xs font-medium text-primary/30">
                                {{ badge.badge.description }}
                            </p>
                        </div>
                        <!-- Badge Value -->
                        <div class="flex items-center gap-1">
                            <span class="text-sm font-semibold">{{ new Date(badge.completed_at!).toLocaleDateString() }}</span>
                            <span class="text-sm"><Clock class="size-4 opacity-40"></Clock></span>
                        </div>
                    </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    </div>


</template>