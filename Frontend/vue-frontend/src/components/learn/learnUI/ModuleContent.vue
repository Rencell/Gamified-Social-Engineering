<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { ChevronRight } from 'lucide-vue-next';
import { useLearningStore } from '@/stores/learning';
import { onMounted, ref, watch } from 'vue';
import LessonCard from './LessonCard.vue';
import lessonService from '@/services/lessonService';

const learningStore = useLearningStore();
const moduleContent = ref<HTMLElement | null>(null);

watch(() => learningStore.selectedModule, () => {
  if (moduleContent.value) {
    moduleContent.value.scrollTop = 0;
  }
});


</script>

<template>
    <div ref="moduleContent" class="bg-secondary/40 flex-[2_2_0%] rounded-lg h-screen overflow-y-scroll scroll-hidden">


        <div class="snap-start">
            <div class=" font-bold mb-2 p-11 pb-6 relative">
                <div class="h-1 w-11 bg-accent absolute bottom-0"></div>
                <p class="text-3xl">{{ learningStore.selectedModule?.title }}</p>
            </div>
            <hr class="border-background mb-10">
            <component :is="learningStore.selectedModule?.component" />
        </div>
        <!-- <hr class="border-background border-2">
        <div class="p-10 flex gap-2 snap-start">
            <Button v-show="learningStore.selectedModule && learningStore.currentModules().findIndex(m => m.title === learningStore.selectedModule?.title) > 0" variant="outline" class="bg-accent" size="lg" @click="learningStore.previousModule()">
                <p class="font-bold text-white">Previous</p>
            </Button>

            <Button class="bg-accent" size="lg" @click="learningStore.nextModule()">
                <p class="font-bold text-white">Next</p>
                <ChevronRight class="text-primary"></ChevronRight>
            </Button>
        </div> -->
        

    </div>
</template>


<style scoped>
.scroll-hidden::-webkit-scrollbar {
  display: none;
}

.scroll-hidden {
  -ms-overflow-style: none;
  /* IE/Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>
