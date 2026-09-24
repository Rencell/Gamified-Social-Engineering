<script setup lang="ts">
defineOptions({ name: 'DefenceDialog' });

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';

import { Shield } from 'lucide-vue-next';

import { computed, onMounted, ref, watch } from 'vue';
import { SimulationService } from '@/services';
import type { OverallDefenceResponse } from '@/services/simulationService';

const overall = ref<OverallDefenceResponse | null>(null);
const loading = ref(false);

const breakdownOpen = ref(false);

watch(overall, (v) => {
    // open once we have data (first load)
    if (v && breakdownOpen.value === false) breakdownOpen.value = true;
});

const scorePct = computed(() => {
    const v = overall.value?.overall_score;
    if (v === null || v === undefined || Number.isNaN(v)) return null;
    return Math.max(0, Math.min(100, v));
});

type DefenceLevelKey = 'clueless' | 'developing' | 'established' | 'resilient' | 'fortified';

const levels = [
    { key: 'clueless' as const, name: 'Clueless', range: '0-20%', min: 0, max: 20, dot: 'rose' },
    { key: 'developing' as const, name: 'Developing', range: '20-40%', min: 20, max: 40, dot: 'rose' },
    { key: 'established' as const, name: 'Established', range: '40-60%', min: 40, max: 60, dot: 'orange' },
    { key: 'resilient' as const, name: 'Resilient', range: '60-80%', min: 60, max: 80, dot: 'emerald' },
    { key: 'fortified' as const, name: 'Fortified', range: '80-100%', min: 80, max: 101, dot: 'emerald' },
];

const currentLevel = computed<DefenceLevelKey>(() => {
    const s = scorePct.value ?? 0;
    if (s < 20) return 'clueless';
    if (s < 40) return 'developing';
    if (s < 60) return 'established';
    if (s < 80) return 'resilient';
    return 'fortified';
});

const componentRows = computed(() => {
    const c = overall.value?.components;
    if (!c) return [];
    return [
        { label: 'Phishing (Email)', score: c.gophish_email.security_score },
        { label: 'Phishing (SMS)', score: c.gophish_sms.security_score },
        { label: 'Popups', score: c.popup.security_score },
    ];
});

onMounted(async () => {
    loading.value = true;
    try {
        overall.value = await SimulationService.get_overall_defence();
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <Dialog :showForUser="true">
        <DialogTrigger asChild>
            <button
                type="button"
                class="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/40 p-2 text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
                aria-label="What is this score?"
            >
                <Shield class="h-5 w-5 cursor-pointer text-green-500" />
            </button>
        </DialogTrigger>

        <DialogContent >
            <DialogHeader class="space-y-2 text-center">
                <!-- <DialogTitle class="text-xl font-semibold tracking-tight">Defence Level</DialogTitle> -->
                <div class="space-y-1 flex items-center flex-col">

                    <p class="text-xl text-accent font-bold font-display">Defence Level</p>
                    <p class="text-sm text-ternary">
                        Your defence score:
                        <span class="font-semibold text-slate-100">
                            <span v-if="loading">Loading…</span>
                            <span v-else>{{ (scorePct ?? 0).toFixed(1) }}%</span>
                        </span>
                    </p>
                    
                </div>

                <div class="mt-2 flex items-center justify-center gap-6 text-sm">
                    <div class="flex items-center gap-2 text-emerald-400">
                        <span class="inline-grid h-4 w-4 place-items-center rounded-full border border-emerald-500/50 bg-emerald-500/10">
                            <svg viewBox="0 0 20 20" fill="currentColor" class="h-3 w-3">
                                <path fill-rule="evenodd" d="M10 4a1 1 0 0 1 1 1v7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 12.586V5a1 1 0 0 1 1-1z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        <span>Improving</span>
                    </div>
                    <div class="flex items-center gap-2 text-amber-400">
                        <span class="inline-grid h-4 w-4 place-items-center rounded-full border border-amber-500/50 bg-amber-500/10">
                            <svg viewBox="0 0 20 20" fill="currentColor" class="h-3 w-3 rotate-180">
                                <path fill-rule="evenodd" d="M10 4a1 1 0 0 1 1 1v7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 12.586V5a1 1 0 0 1 1-1z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        <span>Declining</span>
                    </div>
                </div>
            </DialogHeader>

            <div v-if="overall" class="mt-4 rounded-xl border border-slate-800 bg-slate-900/20 p-4">
                <button
                    type="button"
                    class="flex w-full items-center justify-between gap-3"
                    :aria-expanded="breakdownOpen"
                    @click="breakdownOpen = !breakdownOpen"
                >
                    <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">Breakdown</span>
                    <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        class="h-4 w-4 text-slate-400 transition-transform"
                        :class="breakdownOpen ? 'rotate-180' : ''"
                        aria-hidden="true"
                    >
                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd" />
                    </svg>
                </button>

                <div v-show="!breakdownOpen" class="mt-3 space-y-2">
                    <div v-for="row in componentRows" :key="row.label" class="flex items-center justify-between text-sm">
                        <span class="text-slate-300">{{ row.label }}</span>
                        <span class="font-semibold text-slate-100">{{ row.score }}%</span>
                    </div>
                </div>
            </div>

            <div class="mt-6 space-y-3">
                <div
                    v-for="lvl in levels"
                    :key="lvl.key"
                    class="flex items-center gap-3 rounded-lg px-3 py-2"
                    :class="{
                        'rounded-xl border border-indigo-500/60 bg-indigo-500/10 py-3': lvl.key === currentLevel,
                    }"
                >
                    <div
                        class="p-3 rounded-full"
                        :class="{
                            'bg-rose-500/10': lvl.dot === 'rose',
                            'bg-orange-500/10': lvl.dot === 'orange',
                            'bg-emerald-400/10': lvl.dot === 'emerald',
                        }"
                    >
                        <div
                            class="h-3 w-3 rounded-full"
                            :class="{
                                'bg-rose-500': lvl.dot === 'rose',
                                'bg-orange-500': lvl.dot === 'orange',
                                'bg-emerald-400': lvl.dot === 'emerald',
                            }"
                        ></div>
                    </div>

                    <div class="flex-1">
                        <p
                            class="text-sm font-medium"
                            :class="lvl.key === currentLevel ? 'text-slate-100 font-semibold' : 'text-slate-300'"
                        >
                            {{ lvl.name }}
                        </p>
                        <p class="text-xs" :class="lvl.key === currentLevel ? 'text-slate-400' : 'text-slate-500'">{{ lvl.range }}</p>
                    </div>

                    <span
                        v-if="lvl.key === currentLevel"
                        class="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs text-slate-200"
                    >
                        Current
                    </span>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>