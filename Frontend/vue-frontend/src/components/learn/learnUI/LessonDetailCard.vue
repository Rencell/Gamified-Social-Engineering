<script setup lang="ts">
import ProgressCircle from '@/components/learn/learnUI/ProgressCircle.vue';
import { Button } from '@/components/ui/button';
import { LearnProgress } from '@/components/ui/progress';
import { CircleCheck, Lock, LockKeyhole } from 'lucide-vue-next';

interface Props {
    title?: string | 'title not set'
    progress: number
    description?: string | 'description not set'
    image?: string
    bg?: string
    locked?: boolean
    moduleCount?: number
    isLatest?: boolean
}


const props = defineProps<Props>()


const bgDefined = () => {
    if (props.locked) {
        return 'bg-secondary/30 border-[#35d1ac] ';
    }

    if (props.bg) {
        return `bg-[${props.bg}] brightness-90`;
    } else {
        return 'bg-[#4f1c51] ';
    }

}

</script>

<template>

    <div class="p-5 rounded-xl shadow-2xl duration-175 transition-all" :class="[bgDefined()]" 
    :style="{ backgroundColor: props.bg && !props.locked ? props.bg : '' }">
        <!-- loading  -->


        <div class="flex items-center gap-4 ">

            <div v-if="!locked" class="p-3">
                
                <LearnProgress class="w-85" v-if="isLatest" 
                    :tongue-color="props.bg" 
                    :module-count="moduleCount"
                    position="right"
                    :isLatest="isLatest">
                </LearnProgress>

                <div v-else class="flex items-center gap-3"> 
                    <CircleCheck class="text-green-500" />
                    <p class="font-bold text-primary">COMPLETED!</p>
                </div>
            </div>

            <div v-else class="border-3 w-15 h-15 bg-background rounded-full flex items-center justify-center">
                <LockKeyhole></LockKeyhole>
            </div>
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