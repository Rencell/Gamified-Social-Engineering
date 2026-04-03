<script setup lang="ts">
import { ShieldX, PhoneCall, CirclePlus, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { computed, ref } from 'vue';

interface Feature {
    id: string; 
    title: string;
    description?: string;
    total: number;
    icon: typeof PhoneCall | typeof ShieldX | typeof CirclePlus;
    style: string;
    tips: string;
}

const props = defineProps<{
    callResult: string;
}>();


const feature_list: Feature[] = [
    {
        id: 'refused',
        title: "Refused",
        description: "Simulation refused",
        total: 0,
        icon: ShieldX,
        style: "text-blue-600 bg-blue-50 ring-blue-100",
        tips: "The call was refused by the recipient."
    },
    {
        id: 'gave_information',
        title: "Submitted Info",
        description: "Simulation submitted",
        total: 1,
        icon: CirclePlus,
        style: "text-red-600 bg-red-50 ring-red-100",
        tips: "The call was submitted successfully."
    },
    {
        id: 'seamless',
        title: "Seamless",
        description: "Simulation seamless",
        total: 0 ,
        icon: CirclePlus,
        style: "text-green-600 bg-green-50 ring-green-100",
        tips: "The call was seamless."
    }
];
const filteredResult = computed(() => {
    const result = props.callResult.toLowerCase();
    return feature_list.find(feature => feature.id === result) || null;
});

const openTipTitle = ref<string | null>(null);
const toggleTips = (title: string) => {
    openTipTitle.value = openTipTitle.value === title ? null : title;
};
const isTipsOpen = (title: string) => openTipTitle.value === title;
</script>

<template>
    <div class="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 backdrop-blur-sm p-6 font-display">
        <div class="px-6 pb-10 pt-8">
            <div class="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
                <div
                    class="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-blue-50 ring-1 ring-blue-100">
                    <div class="grid h-10 w-10 place-items-center rounded-full bg-blue-600">
                        <PhoneCall class="h-5 w-5 text-white" />
                    </div>
                </div>

                <h2 class="text-center text-xl font-semibold text-slate-900">
                    Call Summary.
                </h2>

                <p class="mt-2 text-center text-sm leading-6 text-slate-500">
                    You just got a confirmation from <span class="font-medium text-slate-700">Conor</span> on your
                    order.
                    Payment info is successfully filled in based on the same business day.
                </p>

                <div class="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                    <div v-if="filteredResult" class="flex flex-col divide-y divide-slate-100">
                        <button
                            type="button"
                            @click="toggleTips(filteredResult.title)"
                            class="group flex w-full flex-col gap-3 px-5 py-4 text-left transition hover:brightness-[0.99] focus:outline-none">
                            <div class="flex items-center justify-between gap-4">
                                <div class="min-w-0">
                                    <div class="text-sm font-semibold" :class="filteredResult.style.split(' ')[0]">{{ filteredResult.title }}</div>
                                    <div class="mt-0.5 text-xs text-slate-500">{{ filteredResult.description ?? '' }}</div>
                                </div>

                                <div class="flex items-center gap-3">
                                    <div class="text-sm font-semibold" :class="filteredResult.style.split(' ')[0]">{{ filteredResult.total }}</div>
                                    <ChevronDown v-if="!isTipsOpen(filteredResult.title)" class="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                                    <ChevronUp v-else class="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                                </div>
                            </div>

                            <Transition name="fade">
                                <div
                                  v-if="isTipsOpen(filteredResult.title)"
                                  class="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-100">
                                    {{ filteredResult.tips }}
                                </div>
                            </Transition>
                        </button>
                    </div>

                    <div v-else class="px-5 py-4 text-sm text-slate-500">
                        No summary available.
                    </div>
                </div>

                <button type="button"
                    class="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                    Go to homepage
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active{
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
