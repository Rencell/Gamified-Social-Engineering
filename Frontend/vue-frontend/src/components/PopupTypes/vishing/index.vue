<template>
  <div :class="['absolute z-999', wrapperClass]">
    <component v-if="visible" :is="selectedPopup" @click-action="handleClick" @close-action="handleClose"
      class="overflow-hidden" />
  </div>


  
</template>

<script setup lang="ts">
import { VishingService } from '@/services';
import Vishing_popup from './vishing_popup.vue'

defineOptions({ name: 'PopupTypesIndex' })

import { ref, computed, onMounted, type Component } from 'vue';

const props = defineProps<{ scenario: number }>();
// const popupStore = usePopupStore();
const visible = ref(true);

const popupMap: Record<number, Component> = {
  1: Vishing_popup,
};

const positionMap: Record<number, string> = {
  1: 'top-right',
};

const selectedPopup = computed<Component | undefined>(() => popupMap[props.scenario]);

// Translate position keywords to utility classes
const wrapperClass = computed(() => {
  const pos = positionMap[props.scenario] || 'top-left';
  switch (pos) {
    case 'top-left':
      return 'top-0 left-0';
    case 'top-middle':
      return 'top-0 left-1/2 -translate-x-1/2';
    case 'top-right':
      return 'top-0 right-0';
    case 'middle-left':
      return 'top-1/2 left-0 -translate-y-1/2';
    case 'middle':
      return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-dvw h-dvh bg-black/20 flex items-center justify-center';
    case 'middle-right':
      return 'top-1/2 right-0 -translate-y-1/2';
    case 'bottom-left':
      return 'bottom-0 left-0';
    case 'bottom-middle':
      return 'bottom-0 left-1/2 -translate-x-1/2';
    case 'bottom-right':
      return 'bottom-0 right-0';
    case 'right-top':
      return 'top-0 right-0';
    default:
      return 'top-0 left-0';
  }
});

const emit = defineEmits(['result']);

async function handleClick() {
  VishingService.send_score('GAVE_INFORMATION')

  const score = ref<string[]>(['GAVE_INFORMATION']);
  emit('result', score.value);
}


async function handleClose() {
  VishingService.send_score('REFUSED')
  emit('result', 'REFUSED');
}
</script>
