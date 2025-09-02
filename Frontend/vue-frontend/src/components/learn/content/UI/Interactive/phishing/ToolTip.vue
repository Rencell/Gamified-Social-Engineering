<template>
    <div v-for="area in areas" :key="area.id"
        class="absolute bg-accent text-black size-8 rounded-full shadow-xl text-sm flex justify-center items-center border-slate-700/50 border-1 motion-preset-pop cursor-pointer hover:border-red-300 transition-all duration-150"
        :class="setAnimationDelay"
        style="box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
        @click="toggle(area.id)" :style="{ top: `${area.y}px`, left: `${area.x}px` }">

        <p class="font-bold text-lg text-white">+</p>

    </div>

    <div v-show="loading"
        class="absolute z-99 flex w-sm flex-col gap-5 bg-secondary text-primary p-5  rounded-xl border-accent animate-fade-in motion-preset-slide-right "
        :class="{ 'ms-10' : currentArea?.position?.includes('right') || !currentArea?.position}"
        style="box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;"
        :style="getPositionStyle(currentArea)">
        <strong class="text-lg font-bold font-sans motion-preset-fade  motion-delay-300">{{ currentArea?.title
            }}</strong>
        <p class="text-sm font-semibold motion-preset-fade  motion-delay-400">{{ currentArea?.description }}</p>

        <div class="w-full flex justify-end">
            <Button class="bg-primary text-black" @click="loading = false">Close</Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type {TooltipData} from './type'
import { Button } from '@/components/ui/button';


const props = defineProps<{
    areas: TooltipData[]
    animationDelay?: number
}>()

const setAnimationDelay = computed(() => {
    const num = props.animationDelay || 15
    return `motion-delay-${num}00`
});

const loading = ref(false);
const toggle = (area: string) => {
    if (toggleTooltip.value === area) {
        loading.value = false
        toggleTooltip.value = null
        return
    }
    loading.value = false
    toggleTooltip.value = toggleTooltip.value === area ? null : area;
    setTimeout(() => {
        loading.value = true
    }, 100);
}
const toggleTooltip = ref<string | null>(null);

const currentArea = computed(() => {
    return props.areas.find(area => area.id === toggleTooltip.value) || null;
});

const getPositionStyle = (area: TooltipData | null) => {
    if (!area) return {};

    const baseStyle = { top: `${area.y}px`, left: `${area.x}px` };

    switch (area.position) {
        case 'topleft':
            return { ...baseStyle, transform: 'translate(-100%, -100%)' };
        case 'topright':
            return { ...baseStyle, transform: 'translate(0, -100%)' };
        case 'bottomleft':
            return { ...baseStyle, transform: 'translate(-100%, 0)' };
        case 'bottomright':
            return { ...baseStyle, transform: 'translate(0, 0)' };
        default:
            return baseStyle; // Default to top-left alignment
    }
};
</script>