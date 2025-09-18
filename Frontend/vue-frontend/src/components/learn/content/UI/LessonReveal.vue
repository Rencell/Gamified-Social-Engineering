<script setup lang="ts">
import { ref, watchEffect, nextTick, onMounted, type ComponentPublicInstance, watch, computed } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import { useLearningStore } from '@/stores/learning';
import moneyBag from '/Home/money-bag.svg';
import { ArrowBigDown, Check, MoveDown } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { useLoadingPageStore } from '@/stores/pageLoading';
const learningStore = useLearningStore();
const loadingPageStore = useLoadingPageStore();
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

// Scroll to the quiz component
const scrollToQuiz = async () => {
  
  const quizIndex = props.components.findIndex((comp) => comp.component.__name === 'quiz'); // Identify the quiz component
  if (quizIndex !== -1) {
    currentVisibleIndex.value = quizIndex; // Update the visible index to the quiz
    await nextTick();
    const quizRef = componentRefs.value[quizIndex] as HTMLElement | null;
    if (quizRef) {
      quizRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};
 const count = computed(() => loadingPageStore.count);
watch(
  () => props.components.length,
  async (newLength, oldLength) => {
    if (newLength > oldLength && router.query.openQuiz === 'true') {
      if (count.value > 0) return; // Prevent multiple triggers
      await scrollToQuiz();
      loadingPageStore.count++;
    }
  }
);

const router = useRoute();
onMounted(async() => {
  if(props.components.length > 1){
    
    if (router.query.openQuiz === 'true') {
        if (count.value > 0) return; // Prevent multiple triggers
        await scrollToQuiz();
        loadingPageStore.count++;
      }
  }
});



</script>

<template>
  <div>
    <div v-for="(Comp, idx) in components" :key="Comp.id" class="reset-contents relative"
      :ref="el => componentRefs[idx] = el">
      <!-- Component -->
      <component v-if="idx <= currentVisibleIndex" 
        :is="Comp.component" 
        @showDown="toggleActive"
        @completeModule="toggleMarkComplete" 
        :totalLength="components.length" 
        :content_order="Comp.id" />
        
    </div>

    <div class="flex justify-center items-center">
      <div v-if="active" class="w-2xl flex">
        <Button v-if="currentVisibleIndex < components.length - 1" class="ml-auto my-10" @click="showNextComponent">
          <MoveDown />
        </Button>
        <!-- <div v-else class="ml-auto my-10">
          <Button v-if="!withQuiz" :disabled="markComplete" @click="showNextComponent">
            {{ markComplete ? 'Check as Completed' : 'Claim Reward' }}
            <img :src="moneyBag" class="h-full" alt="">
          </Button>
        </div> -->
      </div>
    </div>
  </div>
</template>
