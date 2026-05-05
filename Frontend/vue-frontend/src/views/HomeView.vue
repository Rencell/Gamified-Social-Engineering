<script setup lang="ts">
import shop from '/Home/shop.svg';
import bag from '/Home/bag.svg';
import coin from '/Home/coin.svg';
import Profile from '@/components/home/profile.vue'
import { computed, onMounted, ref } from 'vue';

import { useAuthStore } from '@/stores/auth';
import CurrentLearning from '@/components/home/currentLearning.vue'
import { Button } from '@/components/ui/button';

const coins = computed(() => useAuthStore().User.coin || 0);

import { playSoundFx, SoundFx } from '@/composables/useSoundFx';
import { showPopupFailed } from '@/components/ui/sonner/popupFailed/PopupFailed';
</script>

<template>

    <button @click="showPopupFailed()">Click me</button>
    <div class="flex flex-col gap-5 p-2">
        <div class="flex justify-between h-15">
            <router-link :to="{ name: 'Shop' }">
                <div class="h-15 relative flex items-center"  @click="playSoundFx(SoundFx.Button)">
                    <div clas
                    s="absolute h-15 w-15">
                        <img class="h-15 w-15" :src="shop" alt="">
                    </div>
                    <div class="bg-secondary rounded-full pr-3 flex items-center">
                        <img class="w-8 h-8" :src="coin" alt="">
                        <span class="font-semibold text-sm">{{ coins }}</span>
                    </div>
                </div>
            </router-link>

            <router-link :to="{ name: 'Inventory' }"  @click="playSoundFx(SoundFx.Button)">

                <div class="h-full">
                    <img class="h-full" :src="bag" alt="">
                </div>
            </router-link>
        </div>

        
        <profile @click="playSoundFx(SoundFx.Button)" />
        <current-learning />

    </div>
</template>

