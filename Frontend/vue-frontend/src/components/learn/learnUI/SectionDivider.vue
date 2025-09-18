<script setup lang="ts">
import type { Section } from '@/services/sectionService';
import DeleteSectionAlert from '../dialog/Lesson/Section/deleteSectionAlert.vue';
import UpdateSectionDialog from '../dialog/Lesson/Section/updateSectionDialog.vue';
import SectionProgress from '@/components/ui/progress/SectionProgress.vue';
import { ChevronUp } from 'lucide-vue-next';


defineProps<{
    index: number,
    section: Section,
    sectionProgress: number,
    sectionRefs: boolean

}>()

const emit = defineEmits<{
    (e: 'toggle'): void
}>()
</script>

<template>
    <div class="flex flex-col gap-2 font-display my-5">
        <div class="flex justify-between items-center">
            <div class="font-semibold flex gap-3">
                <div class="size-7 rounded-full bg-accent/50 flex justify-center items-center ">{{ index + 1
                }}</div>
                <p class="text-xl">{{ section.name }}</p>
            </div>

            <div class="flex gap-2 items-center">
                <DeleteSectionAlert :section-id="section.id" />
                <UpdateSectionDialog :section="section" />
                <SectionProgress :model-value="sectionProgress || 0" class="w-20" />
            </div>
        </div>
        <p class="text-sm/loose text-white/50">{{ section.description }}</p>
    </div>

    <slot></slot>


    <div class="mt-5 flex justify-between">
        <div @click="emit('toggle')"
            class="cursor-pointer font-semibold font-display flex gap-4 text-white/50">
            {{ sectionRefs ? 'Hide level details' : 'Show level details' }}
            <ChevronUp :class="{ 'rotate-180': !sectionRefs }" class="transition-transform duration-300">
            </ChevronUp>
        </div>

        <div class="font-bold text-accent">Continue level</div>
    </div>
    <hr class="mt-5 border-ternary" />
</template>