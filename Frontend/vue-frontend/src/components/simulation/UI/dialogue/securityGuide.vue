<template>
    <div class="relative">
        <button type="button"
            class="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/40 p-2 text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
            aria-label="What is this score?" :aria-expanded="isInfoOpen" @click="toggleInfo">
            <Info class="h-5 w-5 text-blue-500 cursor-pointer" />
        </button>

        <!-- lightweight popover/modal -->
        <div v-if="isInfoOpen"
            class="absolute right-0 z-50 mt-3 w-[22rem] rounded-xl border border-slate-700 bg-[#0b1220] p-4 shadow-xl"
            role="dialog" aria-modal="false">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <div class="text-sm font-semibold ">About the Security Risk Score</div>
                    <div class="mt-1 text-xs leading-relaxed text-slate-300">
                        This score reflects how safely you respond to simulated security scenarios.
                        Higher is better.
                    </div>
                </div>
                <button type="button" class="rounded-md p-1 text-slate-400 hover:text-white hover:bg-slate-800/60"
                    aria-label="Close" @click="isInfoOpen = false">
                    <XCircle class="h-5 w-5" />
                </button>
            </div>

            <div class="mt-3 space-y-3 text-xs text-slate-300">
                <div>
                    <div class="font-semibold text-slate-200">What affects it</div>
                    <ul class="mt-1 list-disc pl-5 space-y-1">
                        <li>Safe decisions increase your score.</li>
                        <li>Risky actions (like interacting with suspicious content) can reduce it.</li>
                        <li>Your history below shows what happened and how it impacted your score.</li>
                    </ul>
                </div>

                <div>
                    <div class="font-semibold text-slate-200">What this simulation is</div>
                    <div class="mt-1 leading-relaxed">
                        A controlled training exercise using realistic prompts to help you practice identifying common
                        social-engineering tactics.
                    </div>
                </div>

                <div class="rounded-lg bg-slate-900/40 border border-slate-700 p-3">
                    <div class="font-semibold text-slate-200">Tip</div>
                    <div class="mt-1 leading-relaxed">
                        Look for urgency, unexpected requests, and links that don’t match the sender.
                    </div>
                </div>
            </div>

            <div class="mt-4 flex justify-end">
                <Button variant="secondary" @click="isInfoOpen = false">Got it</Button>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Info, XCircle } from 'lucide-vue-next';
import { ref } from 'vue';

const isInfoOpen = ref(false);
const toggleInfo = () => {
    isInfoOpen.value = !isInfoOpen.value;
};

</script>