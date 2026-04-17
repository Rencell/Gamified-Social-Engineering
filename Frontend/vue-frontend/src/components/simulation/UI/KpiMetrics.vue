<template>
    <div>
        <section>
            <div class="flex items-center justify-between">
                <h1 class="mb-8 text-4xl font-bold font-display">Security Risk Score - <span
                        class="text-yellow-500">{{ props.title }}</span></h1>
                <SecurityGuide />
            </div>
            <Card class="border-[#1a2332] bg-secondary p-8 rounded-2xl">
                <div class="mb-6 flex items-baseline gap-4">
                    <div class="text-5xl font-bold">{{ props.security_score.toFixed(0) }}</div>
                    <div class="text-lg text-gray-400">Security Risk Score</div>
                </div>

                <RiskIndicator :score="security_score" :max-score="100" risk-level="low" />

                <!-- <p class="mt-6 text-sm leading-relaxed text-gray-400">{description}</p> -->

            </Card>
        </section>


        <section>
            <h2 class="my-8 text-3xl font-bold">Campaign Summary</h2>

            <Card class="border-[#1a2332] bg-secondary p-8 rounded-2xl">
                <div class="grid gap-6 grid-cols-3">
                    <div v-for="(value, key) in props.phishingData" :key="key">
                        <div class="text-sm text-gray-400">{{ value.label }}</div>
                        <div class="mt-2 text-3xl font-bold" :class="styleClasses[key]">{{ value.value || 0 }}</div>
                    </div>

                </div>
            </Card>
        </section>

        <!-- text-white, text-[#ff6b35], text-[#ef4444]   -->
    </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import RiskIndicator from '../riskIndicator.vue';
import { Card } from '@/components/ui/card';
import SecurityGuide from './dialogue/securityGuide.vue'


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