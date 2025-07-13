<script setup lang="ts">
import { Progress } from '@/components/ui/progress'
</script>



<template>
    <hr class="border-background border-2">


    <div class="flex justify-center">
        <div class="w-xl flex flex-col gap-4 my-15 p-6 bg-accent/70 rounded-lg">
            <p class="text-3xl font-bold">Questions</p>
    
            <div class="space-y-2">
                <div class="flex justify-between text-sm">
                    <p>Progress</p>
                    <p>33%</p>
                </div>
                <Progress :model-value="33" />
            </div>
        </div>
    </div>
</template>