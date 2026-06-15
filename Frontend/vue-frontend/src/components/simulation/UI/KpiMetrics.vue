<template>
    <div>
        <section>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h1 class="mb-4 sm:mb-0 text-2xl sm:text-4xl font-bold font-display">Security Risk Score - <span class="text-yellow-500">{{ props.title }}</span></h1>
                
            </div>
            <Card class="border-[#1a2332] bg-secondary p-8 rounded-2xl">
                <div class="mb-6 flex items-baseline gap-4">
                    <div class="text-5xl font-bold">{{ props.security_score.toFixed(0) }}</div>
                    <div class="text-lg text-gray-400">Security Risk Score</div>
                </div>

                <RiskIndicator :score="security_score" :max-score="100" risk-level="low" />

            </Card>
        </section>

        <section>
            <h2 class="my-8 text-3xl font-bold">Campaign Summary</h2>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card v-for="(value, key) in props.phishingData" 
                    :key="key" 
                    class="border-[#1a2332] bg-secondary p-8 rounded-2xl">
                    <div >
                        <div class="font-medium text-gray-400">{{ value.label }}</div>
                        <div class="mt-2 text-5xl font-bold" :class="styleClasses[key]">{{ value.value || 0 }}</div>
                    </div>
                </Card>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import RiskIndicator from '../riskIndicator.vue';
import { Card } from '@/components/ui/card';

interface Summary {
    label: string;
    value: number;
}

const props = defineProps({
    security_score: {
        type: Number,
        default: 100,
    },
    title: {
        type: String,
        default: '',
    },
    phishingData: {
        type: Array as PropType<Summary[]>,
        default: () => [],
    },
});

const styleClasses = [
    'text-green-500',
    'text-[#ff6b35]',
    'text-[#ef4444]',
];

</script>