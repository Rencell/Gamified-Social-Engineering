<template>
    <div class="flex-1">
        <div class="h-fit bg-secondary rounded-xl p-7 space-y-7 border-b-4 border-1 border-ternary">
            <p class="text-xl font-bold">Skill Graph</p>

            <div class="flex justify-center">
                <ProgressCircle :progress="50" size="xl" :text="50 + ''" />

            </div>

            <div>
                <Card class="bg-background border-1 border-ternary">
                    <CardContent class="p-4">
                        <div v-for="(item, index) in data" :key="index" class="flex items-center justify-between mb-4 last:mb-0">
                            <p class="text-sm font-medium">{{ item.text }}</p>
                            <SectionProgress :model-value="item.progress"  class="w-20 h-2" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import ProgressCircle from '../learnUI/ProgressCircle.vue'
import SectionProgress from '@/components/ui/progress/SectionProgress.vue'

const data = [{
    text: 'Accuracy',
    progress:20
},
{
    text: 'Time Spent',
    progress:20
},
{
    text: 'Attempts',
    progress:20
},
]


</script>