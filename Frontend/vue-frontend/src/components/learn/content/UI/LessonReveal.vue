<script setup lang="ts">
import { ref, watchEffect, nextTick } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import { useLearningStore } from '@/stores/learning';
const learningStore = useLearningStore();
interface ScrollComponent {
  id: string | number;
  component: any;
  next?: boolean; // Optional property to indicate if this is the last component
}

const props = defineProps<{
  components: ScrollComponent[];
}>();

const currentVisibleIndex = ref(0);

// Refs for each component container
const componentRefs = ref<(HTMLElement | null)[]>([]);

watchEffect(() => {
  componentRefs.value = Array(props.components.length).fill(null);
});



const showNextComponent = async () => {
  if (currentVisibleIndex.value < props.components.length - 1) {
    currentVisibleIndex.value++;
    await nextTick();
    // Scroll to the next component
    const nextRef = componentRefs.value[currentVisibleIndex.value];
    if (nextRef) {
      nextRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else{
    learningStore.nextModule();
  }
};
</script>

<template>
  <div>
    <div v-for="(Comp, idx) in components" class="reset-contents"
      v-show="idx <= currentVisibleIndex" :ref="el => componentRefs[idx] = el">
      <component :is="Comp.component" />
    </div>

     
    <div v-if="components[currentVisibleIndex].next || components[currentVisibleIndex].next == null" class="flex justify-center mt-4 mb-10">
      <Button class="w-2xl" v-if="currentVisibleIndex < components.length - 1" @click="showNextComponent">
        Continue
      </Button>
      <Button class="w-2xl" v-else @click="showNextComponent">
        Next Lesson
      </Button>
    </div>
  </div>
</template>
