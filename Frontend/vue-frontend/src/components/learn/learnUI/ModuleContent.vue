<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useLearningStore } from '@/stores/learning';
import { onMounted, ref, watch } from 'vue';
import LessonCard from './LessonCard.vue';
import lessonService from '@/services/lessonService';

const learningStore = useLearningStore();
const moduleContent = ref<HTMLElement | null>(null);
const isHidden = ref(false); // State to track if the header should be hidden

// Watch the scroll position of the parent container
const handleScroll = () => {
  if (moduleContent.value) {
    isHidden.value = moduleContent.value.scrollTop > 50; // Hide when scrolled more than 50px
  }
};

onMounted(() => {
  if (moduleContent.value) {
    moduleContent.value.addEventListener('scroll', handleScroll);
  }
});

watch(() => learningStore.selectedModule, () => {
  if (moduleContent.value) {
    moduleContent.value.scrollTop = 0;
    isHidden.value = false; // Reset the hidden state when the module changes
  }
});
</script>

<template>
  <div ref="moduleContent" class="bg-secondary/40 flex-[2_2_0%] rounded-lg h-screen overflow-y-scroll scroll-hidden">
    <div class="snap-start">
      <!-- Title and Accent Line -->
      <div class="flex gap-5 sticky -top-2 bg-[#181c28] self-start z-20 font-bold mb-3 p-5 sm:p-11 pb-2 sm:relative transition-all duration-300">
        <div :class="{ hidden: isHidden }" >
          <p class="text-xl sm:text-3xl ">
            {{ learningStore.selectedModule?.title }}
          </p>
          <div class="h-1 w-11 bg-accent mt-4 "></div>
        </div>

        <div class="gap-2 py-2 flex sm:hidden">
          <Button @click="learningStore.previousModule" size="sm" variant="secondary">
            <ChevronLeft :size="17"></ChevronLeft>
          </Button>
          <Button @click="learningStore.nextModule" size="sm" variant="secondary">
            <ChevronRight :size="17"></ChevronRight>
          </Button>
        </div>
      </div>
      <hr class="border-background mb-10 ">

      <component :is="learningStore.selectedModule?.component" class="p-3" />
    </div>
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
