<script setup lang="ts">
import { Progress } from '@/components/ui/progress';

</script>

<template>

    <p class="uppercase font-bold">Your risk assessment</p>
    <div class="flex items-baseline gap-1">
        <span class="text-6xl font-bold text-slate-50">80</span>
        <span class="text-2xl text-slate-400">/100</span>
    </div>

    <Progress :model-value="80" />

    <div class="rounded-full w-30 h-15 border-white border-2 flex items-center justify-center">High Risk</div>
</template>