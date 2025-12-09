<template>
  
    <div :class="['absolute z-50', wrapperClass]" >
        <component
        v-if="visible"
        :is="selectedPopup"
        @click-action="handleClick"
        @close-action="handleClose"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Component } from 'vue';
// import popupService from "../services/popupService";

// Import all 10 popup UIs (siblings of this index.vue)
import Popup1 from "./popup1.vue";
import Popup2 from "./popup2.vue";
import Popup3 from "./popup3.vue";
import Popup4 from "./popup4.vue";
import Popup5 from "./popup5.vue";
import Popup6 from "./popup6.vue";
import Popup7 from "./popup7.vue";
import Popup8 from "./popup8.vue";
import Popup9 from "./popup9.vue";
import Popup10 from "./popup10.vue";
import { PopupService } from '@/services';
import { usePopupStore } from '@/stores/popup';

const props = defineProps<{ scenario: number }>();
const popupStore = usePopupStore();
const visible = ref(true);
const startTime = ref<number | null>(null);

const popupMap: Record<number, Component> = {
  1: Popup1,
  2: Popup2,
  3: Popup3,
  4: Popup4,
  5: Popup5,
  6: Popup6,
  7: Popup7,
  8: Popup8,
  9: Popup9,
  10: Popup10
};

// Position map keyed by scenario id
// Supported positions: top-left, top-middle, top-right, middle-left, middle, middle-right, bottom-left, bottom-middle, bottom-right
const positionMap: Record<number, string> = {
  1: 'middle',
  2: 'middle',
  3: 'top-right',
  4: 'middle',
  5: 'top-middle',
  6: 'middle',
  7: 'top-right',
  8: 'bottom-right',
  9: 'bottom-middle',
  10: 'right-top' // example alias
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

onMounted(() => {
  startTime.value = Date.now();
});

async function handleClick() {
  const reaction = startTime.value ? (Date.now() - startTime.value) / 1000 : 0;
  await PopupService.mark_popup_as_seen(props.scenario, "clicked")
  popupStore.openPopupModal = false;
}

async function handleClose() {
  const reaction = startTime.value ? (Date.now() - startTime.value) / 1000 : 0;
  await PopupService.mark_popup_as_seen(props.scenario, "closed")
  popupStore.openPopupModal = false;
}
</script>
