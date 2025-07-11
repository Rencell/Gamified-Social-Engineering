<script setup lang="ts">
import { Progress } from '@/components/ui/progress'
</script>



<template>
    <hr class="border-background border-2">


    <div class="w-sm flex flex-col gap-4 my-3 p-6">
        <p class="text-3xl font-bold">Questions</p>

        <div class="space-y-2">
            <div class="flex justify-between text-sm">
                <p>Progress</p>
                <p>33%</p>
            </div>
            <Progress :model-value="33" />
        </div>
    </div>
</template>