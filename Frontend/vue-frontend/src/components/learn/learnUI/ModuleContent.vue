<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { ChevronLeft, ChevronRight, Home } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';
import Content from '../content/content.vue'
import { useModuleStore } from '@/stores/module';
import { useRouter } from 'vue-router';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const moduleStore = useModuleStore();
const router = useRouter();
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
      <div class="flex gap-5 sticky -top-2 dark:bg-[#181c28] bg-slate-200 self-start z-20 font-bold mb-3 p-5 sm:p-11 pb-2 sm:relative transition-all duration-300">
        <div :class="{ hidden: isHidden }" >
          <p class="text-xl sm:text-3xl ">
            {{ moduleStore.selectedModule?.title }}
          </p>
          <div class="h-1 w-11 bg-accent mt-4 "></div>
        </div>

        <div class="sm:hidden flex justify-end w-full items-center">
          <div class="gap-2 py-2 flex ">
            <Button @click="router.back()" size="sm">
              <Home></Home>
            </Button>
            
            <Button @click="moduleStore.previousModule" size="sm" variant="secondary">
              <ChevronLeft :size="17"></ChevronLeft>
            </Button>
            <Button @click="moduleStore.nextModule" size="sm" variant="secondary">
              <ChevronRight :size="17"></ChevronRight>
            </Button>
          </div>

          
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
