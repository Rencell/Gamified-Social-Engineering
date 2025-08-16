<script setup lang="ts">
import silver from '/Leaderboard/leaderboard-podium-silver.svg'
import gold from '/Leaderboard/leaderboard-podium-gold.svg'
import bronze from '/Leaderboard/leaderboard-podium-bronze.svg'
import Badge3 from '/levels/badge3.svg'
import RobotSilver from '/Leaderboard/robotSilver.svg'
import RobotBronze from '/Leaderboard/robotBronze.svg'
import GoldMedal from '/Leaderboard/goldMedal.svg'
</script>

<template>
    <div>
        <p class="font-bold text-3xl mb-4">Leaderboard</p>

        <div class="h-[80dvh] w-full bg-[#3635b7] rounded-2xl flex justify-center">
            <div class="flex items-end">
                <div class="flex flex-col items-center">
                    <img :src="Badge3" class="w-16" alt="">
                    <img :src="RobotSilver" class="relative w-20 scale-120" alt="">
                    
                    <div class="relative flex items-center justify-center flex-col">
                        <img :src="silver" alt="">
                        <div class="absolute text-center">
                            <p class="text-6xl font-bold">2</p>
                            <p class="text-sm font-bold">Shibal</p>
                            <p class="text-xs opacity-50">40 XP</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-center gap-3">
                    <img :src="Badge3" class="w-16" alt="">
                    <img :src="GoldMedal" class="relative w-20 scale-150 z-50" alt="">
                    
                    <div class="relative flex items-center justify-center ">
                        <img :src="gold" alt="">
                        <div class="absolute text-center">
                            <p class="text-6xl font-bold">1</p>
                            <p class="text-sm font-bold">Shibal</p>
                            <p class="text-xs opacity-50">40 XP</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-col items-center">
                    <img :src="Badge3" class="w-16" alt="">
                    
                    <img :src="RobotBronze" class="relative w-20 scale-120" alt="">
                    <div class="relative flex items-center justify-center">

                        <img :src="bronze" alt="">
                        <div class="absolute text-center">
                            <p class="text-6xl font-bold">3</p>
                            <p class="text-sm font-bold">Shibal</p>
                            <p class="text-xs opacity-50">40 XP</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-secondary mt-5 rounded-2xl flex flex-col">
            <div v-for="(value, index) in 5" :key="index" class="p-5 flex justify-between "
                :class="index === 3 ? 'bg-accent/20 border-2 border-accent rounded-xl' : 'border-b border-border'">
                <div class="flex gap-4">
                    <p class="font-semibold">{{ 5 - index }}</p>
                    <p class="font-semibold">Shibal</p>
                </div>

                <p class="font-bold">40 XP</p>
            </div>


        </div>
    </div>
</template>
