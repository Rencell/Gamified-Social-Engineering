<script setup lang="ts">
    import { ArrowLeft } from 'lucide-vue-next';
    import { RouterLink } from 'vue-router';
    import badges from '/Home/badge.svg';
</script>
<template>

    <RouterLink :to="{ name: 'Profile' }" class="absolute top-0 left-0 p-4">
        <div class="flex gap-2 mb-5 text-sm items-center text-accent">
            <ArrowLeft :size="15"></ArrowLeft> Back
        </div>
    </RouterLink>

    <p class="text-2xl font-bold">Badges</p>
    <div class="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-6">
        <div class="p-6 space-y-4">
            <img :src="badges" alt="">
            <p class="text-sm text-center">Password</p>
        </div>
        <div class="p-6 space-y-4">
            <img :src="badges" alt="">
            <p class="text-sm text-center">Password</p>
        </div>
        <div class="p-6 space-y-4">
            <img :src="badges" alt="">
            <p class="text-sm text-center">Password</p>
        </div>
        <div class="p-6 space-y-4">
            <img :src="badges" alt="">
            <p class="text-sm text-center">Password</p>
        </div>
    </div>
</template>
