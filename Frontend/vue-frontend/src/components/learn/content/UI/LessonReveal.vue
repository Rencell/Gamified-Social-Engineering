<script setup lang="ts">
import { ref, watchEffect, nextTick, onMounted, type ComponentPublicInstance } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import { useLearningStore } from '@/stores/learning';
import moneyBag from '/Home/money-bag.svg';
import { ArrowBigDown, Check, MoveDown } from 'lucide-vue-next';
const learningStore = useLearningStore();
interface ScrollComponent {
  id: string | number;
  component: any;
  emits?: boolean;
}

const props = withDefaults(defineProps<{
  components: ScrollComponent[];
  withQuiz?: boolean;
}>(), {
  withQuiz: false,
});


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

const markComplete = ref(true);

const toggleMarkComplete = (toggle: boolean) => {
  markComplete.value = toggle;
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
  } else {
    if (markComplete.value)
      return;

    learningStore.activateModuleInteraction();
    learningStore.nextModule();
  }
};

onMounted(() => {
  if (markComplete.value) {
    markComplete.value = !learningStore.selectedModule?.interactive;
  }
});

</script>

<template>
  <div>
    <div v-for="(Comp, idx) in components" class="reset-contents" v-show="idx <= currentVisibleIndex"
      :ref="el => componentRefs[idx] = el">
      <!-- Component -->
       
      <component 
        :is="Comp.component" 
        @showDown="toggleActive" 
        @completeModule="toggleMarkComplete" 
        :totalLength="components.length" />
    </div>

    <div class="flex justify-center items-center">
      <div v-if="active" class="w-2xl flex my-10">
        <Button v-if="currentVisibleIndex < components.length - 1" class="ml-auto" @click="showNextComponent">
          <MoveDown />
        </Button>
        <div v-else class="ml-auto">
          <Button v-if="!withQuiz" :disabled="markComplete" @click="showNextComponent">
            {{ markComplete ? 'Check as Completed' : 'Claim Reward' }}
            <img :src="moneyBag" class="h-full" alt="">
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
