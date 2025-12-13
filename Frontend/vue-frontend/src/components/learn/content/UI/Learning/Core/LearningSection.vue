<script setup lang="ts">
// Removed unused imports and variables to fix compile errors
import EditableCard from '../EditableCard.vue'
import { useEditableText } from '@/composables/useEditableText';
import type { Content } from '@/services/contentService';
import type { LearningType } from '../../learningRegistry';

const emit = defineEmits(['signalDelete', "addComponent"]);

const handleAddComponent = (type: LearningType) => {
  emit("addComponent", type, null);
}

const componentOptions: { type: LearningType; label: string }[] = [
  { type: 'LearningHeader', label: 'Header' },
  { type: 'LearningBody', label: 'Body Text' },
  { type: 'LearningSection', label: 'Section' },
  { type: 'LearningList', label: 'List' },
  { type: 'LearningQuote', label: 'Quote' },
  { type: 'InteractiveMCQ', label: 'Interactive' },
  { type: 'LearningImage2', label: 'Image' },
  { type: 'FlippingCard', label: 'Flipping Card' },
  { type: 'TwoImage', label: 'Two Image' },
  { type: 'ToolTipImage', label: 'Tool Tip Image' },
  { type: 'DescriptionList', label: 'Description List' },
  { type: 'NextCard', label: 'Next Card' },
];

interface Props {
  item?: Content
  siblings?: Content[];
}

defineProps<Props>()

const { editable, deleteComponent, reorderComponent } = useEditableText(null,emit)
</script>
<template>


    <div class="flex flex-col w-full sm:w-2xl my-2 text-gray-200 p-2 sm:p-0"
      :class="!editable ? 'ms-0 animate-parent' : 'ms-5 '">
      
      <editable-card 
        v-show="editable"
        class="border-l-blue-500"
        title="Section"
        :item="item" 
        :siblings="siblings"
        :options="componentOptions" 
        @deleteComponent="deleteComponent" 
        @addComponent="handleAddComponent"
        @reorder="reorderComponent($event)" />
  
      <slot></slot>
    </div>
</template>




<style scoped>
@keyframes drop-in {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Only animate children that are not explicitly marked to skip and not fixed overlays */
.animate-parent > :not(.no-animate):not(.fixed) {
  opacity: 0;
  animation: drop-in 0.5s ease-out forwards;
}

/* Optional: staggered effect applies only to animated children */
.animate-parent > :not(.no-animate):not(.fixed):nth-child(1) {
  animation-delay: 0.3s;
}

.animate-parent > :not(.no-animate):not(.fixed):nth-child(2) {
  animation-delay: 0.5s;
}

.animate-parent > :not(.no-animate):not(.fixed):nth-child(3) {
  animation-delay: 0.7s;
}

.animate-parent > :not(.no-animate):not(.fixed):nth-child(4) {
  animation-delay: 0.9s;
}

.animate-parent > :not(.no-animate):not(.fixed):nth-child(5) {
  animation-delay: 1.1s;
}

.animate-parent > :not(.no-animate):not(.fixed):nth-child(6) {
  animation-delay: 1.3s;
}

.animate-parent > :not(.no-animate):not(.fixed):nth-child(7) {
  animation-delay: 1.5s;
}

.animate-parent > :not(.no-animate):not(.fixed):nth-child(8) {
  animation-delay: 1.7s;
}

/* ...you can extend this further or use JS for dynamic staggering */
</style>
