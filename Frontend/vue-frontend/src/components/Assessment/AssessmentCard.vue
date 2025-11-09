<script setup lang="ts">
import ProgressCircle from '@/components/learn/learnUI/ProgressCircle.vue';
import { Clock, FileText, Wrench } from 'lucide-vue-next';
import Button from '../ui/button/Button.vue';
import UpdateAssessment from './dialog/updateAssessment.vue'

interface Props {
  id: number
  name?: string | 'title not set'
  image?: string | 'image not set'
  bg?: string | '#4f1c51'
  progress: number
  description?: string | 'description not set'
  duration: number | 0
  questions: number | 0
}

const props = defineProps<Props>()


</script>

<template>
    <div class="p-3 rounded-xl" :style="{ backgroundColor: bg }">
        <!-- loading  -->
        <div class="flex justify-between font-display">
            <div class="flex items-center gap-2">
                
                <UpdateAssessment :data="props"/>
                <ProgressCircle :progress="progress" size="lg"></ProgressCircle>
            </div>
            <div class="px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-6 text-sm font-bold">
                <!-- Duration -->
                <div class="flex items-center gap-2 text-purple-200">
                    <Clock class="h-4 w-4" />
                    <span>{{duration}}m</span>
                </div>
    
                <!-- Questions -->
                <div class="flex items-center gap-2 text-purple-200">
                    <FileText class="h-4 w-4" />
                    <span>{{questions}} questions</span>
                </div>
                </div>
    
            </div>
        </div>
        <!-- images -->
        <div class="flex justify-center py-3 lg:py-6 grow-0 shrink-0 relative">
            <div class="aspect-video md:aspect-h-5 w-full max-w-sm h-full flex items-center justify-center">
                <img class="object-scale-down mx-auto h-full" :src="image" alt="">
            </div>
        </div>

        <!-- Text -->
        <div class="flex flex-col justi-between grow">
            <h2 class="text-center font-bold text-2xl my-3">{{name}}</h2>
        </div>
    </div>
</template>