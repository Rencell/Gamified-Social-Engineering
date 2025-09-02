<template>
    <div :class="['relative w-full h-80 perspective-1000  rounded-lg', className]">
        <div :class="[
            'relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer rounded-lg',
            { 'rotate-y-180': isFlipped },
            direction === 'next' ? 'slide-next' : '',
            direction === 'prev' ? 'slide-prev' : ''
        ]" @click="handleFlip" v-for="(value, index) in data" :key="index" v-show="index === currentIndex - 1">
            <!-- Front of card -->
            <div
                class="shadow-lg bg-secondary card absolute inset-0 w-full h-full backface-hidden flex flex-col justify-center items-center p-6 border-t-4 border-t-blue-500 rounded-lg ">
                <div class="flex-1 flex items-center justify-center text-center">
                    
                    <div class="text-xl font-bold text-foreground">
                        {{ value.front }}
                    </div>
                </div>
                <div class="flex justify-end w-full">
                    <RotateCcw class="w-5 h-5 text-muted-foreground" />
                </div>
            </div>

            <!-- Back of card -->
            <div
                class="shadow-lg bg-secondary card absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col justify-center items-center p-6 border-t-4 border-t-green-500 rounded-lg ">
                <div class="flex-1 flex items-center justify-center text-center">
                    <div class="text-xl font-medium text-foreground">
                        {{ value.back }}
                    </div>
                </div>
                <div class="flex justify-end w-full">
                    <RotateCcw class="w-5 h-5 text-muted-foreground" />
                </div>
            </div>
        </div>
        
        <div class="flex gap-5 max-w-sm mx-auto mt-4 ">
            <div @click="togglePrevious" class="cursor-pointer">
                <div :class="{ 'bg-accent/30' : currentIndex <= 1}" class="w-10 h-10 bg-accent rounded-full flex">
                    <ChevronLeft class="w-5 h-5 text-white m-auto"></ChevronLeft>
                </div>
            </div>

            <div class="w-full m-auto flex flex-col items-center">
                <p>{{ currentIndex }} of {{ data.length }}</p>
                <Progress class="h-1" :model-value="(currentIndex/data.length) * 100"></Progress>
            </div>

            <div @click="toggleNext" class="cursor-pointer">
                <div  :class="{ 'bg-accent/30' : currentIndex == data.length}" class="w-10 h-10 bg-accent rounded-full flex">
                    <ChevronRight class="w-5 h-5 text-white m-auto"></ChevronRight>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-vue-next'
import { Progress } from '@/components/ui/progress';
import type { FlippingCardData } from './types';
import pic from '/Learning/Content/introToSocialEngineering/WhatIsSocialEngineering/conversation.webp'

const props = defineProps<{
    className?: string,
    data: FlippingCardData[]
}>()

const data: FlippingCardData[] = props.data
const direction = ref<'next' | 'prev'>('next')
const currentIndex = ref(1)

const toggleNext = () => {

    if (currentIndex.value <= data.length - 1) {
        currentIndex.value += 1
        direction.value = 'next'
    }
    isFlipped.value = false
}
const togglePrevious = () => {

    if (currentIndex.value > 1) {
        currentIndex.value -= 1
        direction.value = 'prev'
    }
    isFlipped.value = false
}

const isFlipped = ref(false)

const handleFlip = () => {
    isFlipped.value = !isFlipped.value
}
</script>

<style scoped>
.perspective-1000 {
    perspective: 1000px;
}

.transform-style-preserve-3d {
    transform-style: preserve-3d;
}

.rotate-y-180 {
    transform: rotateY(180deg);
}

.backface-hidden {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}


.slide-next {
    animation: slideNext 0.7s ease-in-out;
}

@keyframes slideNext {
    0% {
        transform: translateX(20%);
        opacity: 0;
    }

    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Animation for sliding to the previous card */
.slide-prev {
    animation: slidePrev 0.7s ease-in-out;
}

@keyframes slidePrev {
    0% {
        transform: translateX(-20%);
        opacity: 0;
    }

    100% {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
