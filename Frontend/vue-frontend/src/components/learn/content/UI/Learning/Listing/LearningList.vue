<template>
  <div class="p-4 rounded-xl">
    <ul :class="[!editable ? (animation ? 'animate-parent' : 'animate-default') : 'ms-0']"
      class="list-none p-0 m-0 space-y-2">
      <editable-card 
        v-show="editable" 
        class="border-l-green-500" 
        title="List" 
        :item="item" 
        :siblings="siblings"
        :options="componentOptions"
        @deleteComponent="deleteComponent" 
        @addComponent="handleAddComponent"
        @reorder="reorderComponent" />
      <slot></slot>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import type { LearningType } from '../../learningRegistry.ts';
import EditableCard from '../EditableCard.vue'
import type { Content } from '@/services/contentService';
import { useEditableText } from '@/composables/useEditableText';

const emit = defineEmits(['signalDelete', "addComponent"]);

defineProps({
  animation: {
    type: Boolean,
    default: true
  },
  item: {
    type: Object as PropType<Content>,
    required: false,
  },
  siblings: {
    type: Array as PropType<Content[]>,
    required: false,
  },
})


const showAddComponents = ref(false)


const handleAddComponent = (type: "LearningListItem" | "LearningListItemNumbered") => {
  emit("addComponent", type, null);
  showAddComponents.value = true;
}

const componentOptions: { type: LearningType; label: string }[] = [
  { type: 'LearningListItem', label: 'List Item' },
  { type: 'LearningListItemNumbered', label: 'Numbered List Item' },
];


const { editable, deleteComponent, reorderComponent } = useEditableText(null,emit)
</script>


<style scoped>
@keyframes drop-in {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes drop-in-default {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    transform: translateX(0);
  }
}

.animate-parent>* {
  opacity: 0;
  animation: drop-in 0.5s ease-out forwards;
}

.animate-default>* {
  animation: drop-in-default 0.5s ease-out forwards;
  transition: opacity 0.3s ease-in-out;
}

/* Optional: staggered effect */
.animate-parent>*:nth-child(1) {
  animation-delay: 0.6s;
}

.animate-parent>*:nth-child(2) {
  animation-delay: 0.8s;
}

.animate-parent>*:nth-child(3) {
  animation-delay: 1.2s;
}

.animate-parent>*:nth-child(4) {
  animation-delay: 1.4s;
}

.animate-parent>*:nth-child(5) {
  animation-delay: 1.6s;
}

.animate-parent>*:nth-child(6) {
  animation-delay: 1.8s;
}

.animate-parent>*:nth-child(7) {
  animation-delay: 2.0s;
}

.animate-parent>*:nth-child(8) {
  animation-delay: 2.2s;
}

.animate-parent>*:nth-child(9) {
  animation-delay: 2.4s;
}

.animate-parent>*:nth-child(10) {
  animation-delay: 2.6s;
}

.animate-parent>*:nth-child(11) {
  animation-delay: 2.8s;
}

/* ...you can extend this further or use JS for dynamic staggering */
</style>