<template>


    <RouterLink :to="{ name: 'Home' }" class="absolute top-0 left-0 p-4">
        <div class="flex gap-2 mb-5 text-sm items-center text-accent">
            <ArrowLeft :size="15"></ArrowLeft> Back
        </div>
    </RouterLink>
    <div class="space-y-4">
        <p class="text-3xl font-bold text-center">Welcome to Cyber Shop</p>
        <div class="p-4 w-full bg-blue-600 rounded-lg">

            f
        </div>

        <div class="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
            <div class="p-2 space-y-4 bg-secondary rounded-lg">
                <div>
                    <img :src="christmasBackground" class="rounded-lg" alt="">
                </div>
                <div
                    class="bg-linear-to-r from-transparent via-blue-500/40 to-transparent py-1 md:py-2 px-20 mb-3 text-center text-xs uppercase font-semibold text-blue-500 mx-auto">
                    <span>Common</span>
                </div>

                <div class="text-center space-y-2">
                    <h1 class="text-sm font-bold">Gingerbread Haven</h1>
                    <p class="text-sm text-gray-500">
                        Lorem ipsum dolor sit amet.
                    </p>
                </div>
                
                <div>
                    <Button class="w-full">
                        <img :src="coin" class="w-8 h-8" alt="">
                        <p class="font-bold text-lg -ms-2">60</p>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import christmasBackground from '/Home/christmasBackground@3x.webp';
import { Button } from '@/components/ui/button';
import coin from '/Home/coin.svg';
</script>