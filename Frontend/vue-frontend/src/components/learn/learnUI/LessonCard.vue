<script setup lang="ts">
import ProgressCircle from '@/components/learn/learnUI/ProgressCircle.vue';
import { Lock, LockKeyhole } from 'lucide-vue-next';

interface Props {
    title?: string | 'title not set'
    progress: number
    description?: string | 'description not set'
    image?: string
    bg?: string
    locked?: boolean
    AllowProgress?: boolean
}


const props = defineProps<Props>()


const bgDefined = () => {
    if (props.locked) {
        return 'bg-secondary/30';
    }

    if (props.bg) {
        return props.bg;
    } else {
        return 'bg-[#4f1c51]';
    }
}

</script>

<template>

    <div class="p-3 rounded-2xl" :class="[bgDefined()]">

        <!-- loading  -->
         
        <ProgressCircle v-if="!locked" :progress="progress" size="lg"></ProgressCircle>

        <div v-else class="border-3 w-15 h-15 bg-background rounded-full flex items-center justify-center">
            <LockKeyhole></LockKeyhole>
        </div>

        <!-- images -->
        <div class="flex justify-center py-3 lg:py-6 grow-0 shrink-0 relative">
            <div class="aspect-video md:aspect-h-5 w-full max-w-sm h-full flex items-center justify-center">
                <img :class="['object-scale-down mx-auto w-72', locked ? 'grayscale-100' : '']"
                    :src="image ? image : '/SecurityAwarenessEssentials@3x.svg'" alt="">
            </div>
        </div>

        <!-- Text -->
        <div class="flex flex-col justi-between grow">
            <h2 class="text-center font-bold text-2xl my-3">{{ title }}</h2>
            <p class="text-center text-gray-400 mb-2 text-xs font-bold">{{ description }}</p>
        </div>
    </div>
</template>