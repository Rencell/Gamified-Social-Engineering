<script setup lang="ts">
import { ref, watchEffect, nextTick, onMounted, type ComponentPublicInstance } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import { useLearningStore } from '@/stores/learning';
import { ArrowBigDown, Check, MoveDown } from 'lucide-vue-next';
const learningStore = useLearningStore();
interface ScrollComponent {
  id: string | number;
  component: any;
  emits?: boolean; 
}

const props = defineProps<{
  components: ScrollComponent[];
}>();


const currentVisibleIndex = ref(0);

// Refs for each component container
const componentRefs = ref<(HTMLElement | Element | ComponentPublicInstance | null)[]>([]);

watchEffect(() => {
  componentRefs.value = Array(props.components.length).fill(null);
});

const active = ref(true);
const toggleActive = (toggle: boolean) => {
  active.value = toggle;
};

const active2 = ref(true);

const toggleActive2 = (toggle: boolean) => {
  active2.value = toggle;
};



const showNextComponent = async () => {
  if (currentVisibleIndex.value < props.components.length - 1) {
    currentVisibleIndex.value++;
    await nextTick();
    // Scroll to the next component
    const nextRef = componentRefs.value[currentVisibleIndex.value] as HTMLElement | null;
    if (nextRef) {
      nextRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else{
    learningStore.activateModuleInteraction();
    learningStore.nextModule();
  }
};

 

</script>

<template>
  <div>
    <div v-for="(Comp, idx) in components" class="reset-contents"
      v-show="idx <= currentVisibleIndex" 
      
      :ref="el => componentRefs[idx] = el">
      <!-- Component -->
      <component 
      :is="Comp.component" 
      @showDown="toggleActive" 
      @toggleA="toggleActive2" 
      />
    </div>

    <div class="flex justify-center items-center">
      <div v-if="active" class="w-2xl flex my-10">
        <Button class="ml-auto" v-if="currentVisibleIndex < components.length - 1" @click="showNextComponent">
          <MoveDown />
        </Button>
        <Button class="ml-auto" :disabled="active2" v-else @click="showNextComponent">
          {{active2 ? 'Check as Completed' : 'Next Lesson'}}
          <Check />
        </Button>
      </div>
    </div>
  </div>
</template>
