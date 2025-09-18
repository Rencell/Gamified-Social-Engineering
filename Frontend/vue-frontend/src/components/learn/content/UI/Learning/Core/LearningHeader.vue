<template>
  <div :class="['text-3xl font-bold mb-3 animate-in fade-in', customClass]">
    <template v-if="!editable">
      <slot></slot>
      <learning-bold :text="my_text.text" />
    </template>
    <template v-else>
      <editable-text 
        :text="my_text.text" 
        :item="item"
        :siblings="siblings" 
        :props="my_text" 
        type="LearningHeader" 
        @updateProps="updateProps($event)"
        @deleteText="deleteComponent"
        @reorder="reorderComponent($event)" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import EditableText from '../EditableText.vue'
import LearningBold from '../Highlight/LearningBold.vue'
import { useEditableText } from '@/composables/useEditableText';
import type { Content } from '@/services/contentService';

interface Props {
  customClass?: string | string[] | Record<string, boolean>;
  text?: string;
  item?: Content
  siblings?: Content[];
}

const props = defineProps<Props>()
const emit = defineEmits(['giveProps', 'signalDelete', 'moveOrder']); // Define emits
const { editable, my_text, updateProps, deleteComponent, reorderComponent } = useEditableText({ text: props.text }, emit)

</script>