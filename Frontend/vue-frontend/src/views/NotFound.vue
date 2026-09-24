<script setup lang="ts">
// ...existing code...
import { ChevronLeft } from 'lucide-vue-next';
import email from '/ErrorPage/link_broken.svg';
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
    <div class="flex absolute inset-0 items-center justify-center ">

        <div class="w-2xl flex flex-col items-center justify-center space-y-6 p-8">
            <div class="w-30"><img :src="email" class="w-full" alt=""></div>
            <p class="font-bold text-xl">Oops... Page not found</p>

            <p class="text-slate-400 text-sm text-center font-medium">
                Seems like the link you followed is broken or the page has been removed.
            </p>

            <RouterLink :to="{name : 'Home'}">
                <Button>
                    <ChevronLeft></ChevronLeft>Back
                </Button>
            </RouterLink>
        </div>

    </div>
</template>