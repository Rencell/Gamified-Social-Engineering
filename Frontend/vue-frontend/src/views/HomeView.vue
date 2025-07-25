<script setup lang="ts">
import shop from '/Home/shop.svg';
import bag from '/Home/bag.svg';
import coin from '/Home/coin.svg';
import christmasBackground from '/Home/christmasBackground@3x.webp';


</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="flex justify-between h-15">
            <div class="h-15 relative flex items-center">
                <div class="absolute h-15 w-15">
                    <img class="h-15 w-15" :src="shop" alt="">
                </div>
                <div class="bg-secondary rounded-full pl-15 pr-3 flex items-center">
                    <img class="w-8 h-8" :src="coin" alt="">
                    <span class="font-semibold text-sm">112</span>
                </div>
            </div>
            <div class="h-full">
                <img class="h-full" :src="bag" alt="">
            </div>


        </div>

        <div class="w-full h-72 bg-secondary rounded-lg flex flex-col">
            <div class="w-full bg-amber-300 h-2/3 bg-contain bg-repeat rounded-t-lg"
                :style="{ backgroundImage: `url(${christmasBackground})` }">
            </div>
            <div class="flex rounded-b-lg justify-center">
                <div class="relative bottom-10 w-30 h-30 bg-secondary rounded-full flex items-center justify-center">
                    <img class="w-full" :src="shop" alt="">

                </div>


            </div>
        </div>

        <div class="flex flex-col gap-2">
            <p class="font-bold text-lg">Badges</p>

            <div>
                <div class="flex gap-5">
                    <div class="bg-secondary rounded-xl p-7">

                        <img class="grayscale-100" :src="shop" alt="">
                    </div>
                    <img class="bg-secondary rounded-xl p-7" :src="shop" alt="">
                    <img class="bg-secondary rounded-xl p-7" :src="shop" alt="">
                </div>
            </div>
        </div>
    </div>
</template>