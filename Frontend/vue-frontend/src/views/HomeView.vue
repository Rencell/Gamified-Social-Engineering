<script setup lang="ts">
import shop from '/Home/shop.svg';
import bag from '/Home/bag.svg';
import coin from '/Home/coin.svg';
import exp from '/Home/exp.png';
import christmasBackground from '/Home/christmasBackground@3x.webp';
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useLevelStore } from '@/stores/level';

import { toast } from 'vue-sonner'
import { useCosmeticStore } from '@/stores/cosmetic';
import RivePlayer from '@/components/RivePlayer.vue';
const levelStore = useLevelStore();
const cosmeticStore = useCosmeticStore();
const authStore = useAuthStore();

const coins = computed(() => authStore.User.coin || 0);

cosmeticStore.fetchCosmetics()


</script>

<template>
    <div class="flex flex-col gap-5 p-3 sm:p-0">
        <div class="flex justify-between h-15">
            <router-link :to="{ name: 'Shop' }">
                <div class="h-15 relative flex items-center">
                    <div class="absolute h-15 w-15">
                        <img class="h-15 w-15" :src="shop" alt="">
                    </div>
                    <div class="bg-secondary rounded-full pl-15 pr-3 flex items-center">
                        <img class="w-8 h-8" :src="coin" alt="">
                        <span class="font-semibold text-sm">{{ coins }}</span>
                    </div>
                </div>
            </router-link>

            <router-link :to="{ name: 'Inventory' }">

                <div class="h-full">
                    <img class="h-full" :src="bag" alt="">
                </div>
            </router-link>
        </div>
        <RouterLink :to="{ name: 'Profile' }" class="cursor-pointer">


            <div class="cursor-pointer">
                <div class="w-full h-72 bg-secondary rounded-lg flex flex-col">
                    <div class="w-full bg-amber-300 h-2/3 bg-contain bg-repeat rounded-t-lg"
                        :style="{ backgroundImage: `url(${cosmeticStore.equipBackground?.image})` }">
                    </div>
                    <div class="flex rounded-b-lg justify-evenly items-center">

                        <div class="space-y-2 text-center ">
                            <div class="w-full flex justify-center items-center">
                                <img :src="levelStore.currentBadge.image" class="w-15 h-15" alt="">
                            </div>
                            <div class="relative flex items-center">
                                <div class="rounded-full h-5 w-30 bg-ternary/50 ">
                                    <div class="w-20 bg-yellow-700 h-full rounded-full flex items-center pl-10 text-xs">
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
                        <div class="rounded-full h-6 w-30 bg-primary">

                        </div>

                    </div>
                </div>
            </div>
        </RouterLink>

    </div>
</template>