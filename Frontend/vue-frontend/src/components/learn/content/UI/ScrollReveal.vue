<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useSnapObserver } from '@/composables/useSnapObserver';

interface ScrollComponent {
  id: string | number;
  component: any;
}

const props = defineProps<{
  components: ScrollComponent[];
}>();

const contentKeys = ref<number[]>([]);

// Initialize keys based on number of components
watchEffect(() => {
  contentKeys.value = props.components.map(() => 0);
});

// Observer to re-render component when visible
useSnapObserver((entry) => {
  const idx = props.components.findIndex(comp => comp.id == entry.target.id);
  if (idx !== -1) {
    contentKeys.value[idx]++;
  }
});
</script>

<template>
  <div>
    <div
      v-for="(Comp, idx) in components"
      :key="idx"
      :id="Comp.id"
      class="reset-content"
    >
      <component :is="Comp.component" :key="contentKeys[idx]" />
    </div>
  </div>
</template>
