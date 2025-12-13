<script setup lang="ts">
import type { Section } from '@/services/sectionService';
import DeleteSectionAlert from '../dialog/Lesson/Section/deleteSectionAlert.vue';
import UpdateSectionDialog from '../dialog/Lesson/Section/updateSectionDialog.vue';
import SectionProgress from '@/components/ui/progress/SectionProgress.vue';
import { ChevronUp } from 'lucide-vue-next';
import { computed } from 'vue';
import Badge from '@/components/ui/badge/Badge.vue';


const props = defineProps<{
    index: number,
    section: Section,
    sectionProgress: number,
    sectionRefs: boolean

}>()

const emit = defineEmits<{
    (e: 'toggle'): void
}>()


const isSectionComplete = computed(() => {
    if(props.section.modules.length === 0) return false;
    const fk = props.section.modules.filter(mod => mod.locked === false);
    return props.section.modules.length === fk.length;
});

</script>

<template>
    <div class="flex flex-col gap-2 font-display my-5">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
            <div class="font-semibold flex items-center gap-3 flex-wrap">
                <div class="size-6 md:size-7 rounded-full bg-accent/50 flex justify-center items-center ">{{ index + 1 }}</div>
                <p class="text-lg md:text-xl break-words">{{ section.name }}</p>
                <Badge v-if="isSectionComplete" variant="success">Completed</Badge>
            </div>

            <div class="flex gap-2 items-center flex-wrap justify-start md:justify-end">
                <DeleteSectionAlert :section-id="section.id" />
                <UpdateSectionDialog :section="section" />
                <SectionProgress :model-value="sectionProgress || 0" class="w-16 md:w-20" />
            </div>
        </div>
        <p class="text-xs md:text-sm/loose text-white/50 break-words">{{ section.description }}</p>
    </div>

    <slot></slot>


    <div class="mt-5 flex flex-col md:flex-row justify-between gap-3 md:gap-0">
        <div @click="emit('toggle')" class="cursor-pointer font-semibold font-display flex items-center gap-2 md:gap-4 text-white/50">
            {{ sectionRefs ? 'Hide level details' : 'Show level details' }}
            <ChevronUp :class="{ 'rotate-180': !sectionRefs }" class="transition-transform duration-300 w-4 h-4 md:w-5 md:h-5"></ChevronUp>
        </div>

        <div class="font-bold text-accent">Continue level</div>
    </div>
    <hr class="mt-5 border-ternary" />
</template>