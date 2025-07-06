<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { ArrowLeft } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

defineEmits(['start']);
</script>

<template>
    <div class="relative flex flex-col justify-center items-center w-xl h-100 my-4 bg-secondary rounded-xl">
        <RouterLink :to="{ name: 'Learn-Phishing' }" class="absolute top-0 left-0 p-4">
            <div class="flex gap-2 mb-5 text-sm items-center text-accent">
                <ArrowLeft :size="15"></ArrowLeft> Back
            </div>
        </RouterLink>
        <div class="font-bold text-3xl">Phishing 101</div>
        <br>
        <div class="text-xs ">Click the button below to start the lesson.</div>
        <br>
        <Button @click="$emit('start')" class="bg-accent text-xs font-semibold">Start Lesson</Button>
    </div>
</template>
