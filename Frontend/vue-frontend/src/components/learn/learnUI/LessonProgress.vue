<script setup lang="ts">
import { Progress } from '@/components/ui/progress';
import { ChartColumnBig, Timer } from 'lucide-vue-next';

defineProps<{
    progress: number
}>()
</script>

<template>
    <div class="flex gap-5 justify-center font-display">
                
        <div class="flex gap-2 my-4 items-center text-sm dark:text-muted-foreground text-white">
            <div class="w-20">
                <Progress :model-value="progress" bg-background="bg-ternary" bg="bg-blue-500"></Progress>
            </div>
            <div>{{ isNaN(progress) ? 0 : progress }}% complete</div>
        </div>
    
        <div class="flex gap-2 my-4 items-center text-sm dark:text-muted-foreground text-white">
            <Timer></Timer>3 hours
        </div>
    
        
    </div>
</template>