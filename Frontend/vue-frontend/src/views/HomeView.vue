<script setup lang="ts">
import shop from '/Home/shop.svg';
import bag from '/Home/bag.svg';
import coin from '/Home/coin.svg';
import exp from '/Home/exp.png';
import badge from '/Home/badge.svg';
import avatar from '/Home/avatar.svg';
import christmasBackground from '/Home/christmasBackground@3x.webp';
import { Button } from '@/components/ui/button';
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

const coins = computed(() => authStore.User.coin || 0);
const xp = computed(() => authStore.User.exp || 0);
const level = computed(() => authStore.User.level || 0);

</script>

<template>
    
    <div class="flex flex-col gap-5">
        <div class="flex justify-between h-15">
            
            <router-link :to="{ name: 'Shop' }">
                <div class="h-15 relative flex items-center">
                    <div class="absolute h-15 w-15">
                        <img class="h-15 w-15" :src="shop" alt="">
                    </div>
                    <div class="bg-secondary rounded-full pl-15 pr-3 flex items-center">
                        <img class="w-8 h-8" :src="coin" alt="">
                        <span class="font-semibold text-sm">{{coins}}</span>
                    </div>
                </div>
            </router-link>
            <div class="h-full">
                <img class="h-full" :src="bag" alt="">
            </div>
            
            
        </div>
        
        <div class="w-full h-72 bg-secondary rounded-lg flex flex-col">
            <div class="w-full bg-amber-300 h-2/3 bg-contain bg-repeat rounded-t-lg"
            :style="{ backgroundImage: `url(${christmasBackground})` }">
        </div>
        <div class="flex rounded-b-lg justify-evenly items-center">
            
            <div class="space-y-2 text-center ">
                <p class="font-bold">Level {{ level }}</p>
                <div class="rounded-full h-5 w-35 bg-ternary/50 relative">
                    <div class="w-20 bg-yellow-600/60 h-full rounded-full flex items-center pl-10 text-xs">
                    </div>
                    <img class="w-9 h-9 absolute -top-2 -left-2 " :src="exp" alt="">
                </div>
                {{ xp }} xp
            </div>
            <div class="overflow-hidden relative bottom-10 w-30 h-30 bg-black border-secondary border-5 rounded-full flex items-center justify-center">
                <img class="absolute -bottom-1 z-1 scale-110" :src="avatar" alt="">
                
            </div>
            <div class="rounded-full h-6 w-40 bg-primary">
                
            </div>
            
        </div>
    </div>
    
    <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <p class="font-bold text-lg">Badges</p>
            <RouterLink :to="{ name: 'Badges' }">
                <Button asChild variant="link" class="my-auto text-sm">see more</Button>
            </RouterLink>
        </div>

            <div>
                <div class="flex gap-5">

                    <img class="bg-secondary rounded-xl p-7 w-50 h-50" :src="badge" alt="">
                    <img class="bg-secondary rounded-xl p-7 w-50 h-50" :src="badge" alt="">
                    <div class="h-50 flex items-center justify-center">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>