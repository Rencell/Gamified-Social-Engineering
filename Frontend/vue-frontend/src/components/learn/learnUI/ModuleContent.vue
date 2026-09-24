<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { ChevronLeft, ChevronRight, Home } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';
import Content from '../content/content.vue'
import { useModuleStore } from '@/stores/module';
import { useRouter } from 'vue-router';

const moduleStore = useModuleStore();
const router = useRouter();
const moduleContent = ref<HTMLElement | null>(null);
const isHidden = ref(false); 

const handleScroll = () => {
  if (!moduleContent.value) return;

  const shouldHide = moduleContent.value.scrollTop >= 50;

  if (shouldHide !== isHidden.value) {
    isHidden.value = shouldHide;
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
      <div class="flex gap-5 sticky -top-2 self-start z-20 font-bold mb-3 p-5 sm:p-11 pb-2 sm:relative transition-all duration-300" :class="[isHidden ? 'bg-transparent' : 'dark:bg-[#181c28] bg-slate-200']">
        <div  :class="{'opacity-0 z-0': isHidden, 'opacity-100': !isHidden}" class="transition-opacity duration-300">
          <p class="text-xl sm:text-3xl ">
            {{ moduleStore.selectedModule?.title }}
          </p>
          <div class="h-1 w-11 bg-accent mt-4 "></div>
        </div>

        <div class="sm:hidden flex justify-center w-full items-center  rounded-xl backdrop:backdrop-blur-2xl" :class="[isHidden ? 'absolute -bottom-2 left-0 p-3 transition-all duration-300 bg-transparent' : 'dark:bg-[#181c28] bg-slate-200']">
          <div class="gap-2 py-2 flex " :class="{'border-2 border-accent backdrop-blur-3xl px-5 rounded-xl opacity-70' : isHidden}">
            <Button @click="moduleStore.previousModule" size="sm">
              <ChevronLeft :size="17"></ChevronLeft>
            </Button>
            <Button @click="router.back()" size="sm" variant="destructive">
              <Home></Home>
            </Button>
            
            <Button @click="moduleStore.nextModule" size="sm" >
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
