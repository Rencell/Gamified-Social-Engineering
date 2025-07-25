<script setup lang="ts">
import ProgressCircle from '@/components/learn/learnUI/ProgressCircle.vue';

interface Props {
  title?: string | 'title not set'
  progress: number
  description?: string | 'description not set'
  image?: string
  bg?: string
}

const props = defineProps<Props>()


</script>

<template>

    <div class="p-3 rounded-xl" :class="bg ? bg : 'bg-[#4f1c51]'">
        <!-- loading  -->
        <ProgressCircle :progress="progress" size="lg"></ProgressCircle>

        <!-- images -->
        <div class="flex justify-center py-3 lg:py-6 grow-0 shrink-0 relative">
            <div class="aspect-video md:aspect-h-5 w-full max-w-sm h-full flex items-center justify-center">
                <img class="object-scale-down mx-auto w-72" :src="image ? image : '/SecurityAwarenessEssentials@3x.svg'" alt="">
            </div>
        </div>

        <!-- Text -->
        <div class="flex flex-col justi-between grow">
            <h2 class="text-center font-bold text-2xl my-3">{{title}}</h2>
            <p class="text-center text-gray-400 mb-2 text-xs font-bold">{{ description }}</p>
        </div>
    </div>
</template>