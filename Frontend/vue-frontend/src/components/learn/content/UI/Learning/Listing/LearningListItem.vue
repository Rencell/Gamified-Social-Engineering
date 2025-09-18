<template>
  <li v-if="!editable" class="flex items-center justify-between mb-4">
    <div class="flex items-center">
      <span class="flex-shrink-0 inline-block w-3 h-3 rounded-full bg-[#299F69] mr-6"></span>
      <div :class="[
        'text-gray-200 font-medium',
        size === 'lg' ? 'text-base/loose' : 'text-sm/loose'
      ]">
        <slot></slot>
        <learning-bold :text="my_text.text" />
      </div>
    </div>
    <img v-if="image" :src="image" alt="list item image" class="w-15 h-15 object-cover rounded-md ml-6" />
  </li>

  <template v-else>
    <EditableText 
      :text="my_text.text" 
      :props="my_text" 
      type="LearningListItem" 
      @updateProps="updateProps($event)" 
      @deleteText="deleteComponent" />
  </template>
</template>

<script setup lang="ts">
import { defineProps, inject, ref } from 'vue';
import EditableText from '../EditableText.vue'
import LearningBold from '../Highlight/LearningBold.vue'
import { useEditableText } from '@/composables/useEditableText';


const props = defineProps({
  image: {
    type: String,
    default: null,
  },
  size: {
    type: String as () => 'lg' | 'sm',
    default: 'sm',
  },
  text: {
    type: String,
    default: '',
  }
});

const emit = defineEmits(['giveProps', 'signalDelete']); // Define emits
const { editable, my_text, updateProps, deleteComponent } 
  = useEditableText({ text: props.text || null }, emit)


</script>
