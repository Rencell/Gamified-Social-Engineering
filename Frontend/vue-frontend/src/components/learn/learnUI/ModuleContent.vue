<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useLearningStore } from '@/stores/learning';
import { onMounted, ref, watch } from 'vue';
import Content from '../content/content.vue'
import { useModuleStore } from '@/stores/module';

const learningStore = useLearningStore();
const moduleStore = useModuleStore();
const moduleContent = ref<HTMLElement | null>(null);
const isHidden = ref(false); 

const handleScroll = () => {
  if (moduleContent.value) {
    isHidden.value = moduleContent.value.scrollTop > 50; 
  }
};

onMounted(() => {
  if (moduleContent.value) {
    moduleContent.value.addEventListener('scroll', handleScroll);
  }
});

watch(() => moduleStore.selectedModule, () => {
  if (moduleContent.value) {
    moduleContent.value.scrollTop = 0;
    isHidden.value = false; 
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
            {{ moduleStore.selectedModule?.title }}
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
      
      <!-- <component :is="learningStore.selectedModule?.component" class="p-3" /> -->
      <Content />
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
