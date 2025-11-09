<template>
  <li v-if="!editable" class="flex items-center justify-between mb-4 last:mb-0">
    <div class="flex items-start">
      <span class="flex-shrink-0 w-6 h-6 rounded-full bg-[#299F69] text-white flex items-center justify-center text-xs font-bold mt-1 mr-6"></span>
      <div class="text-gray-200 text-sm/loose font-medium">
        <slot></slot>
        <LearningBold :text="my_text.text" />
      </div>
    </div>
    <img v-if="image" :src="image" alt="list item image" class="w-12 h-12 object-cover rounded-md ml-6" />
  </li>

  <template v-else>
    <EditableText 
      :text="my_text.text" 
      :props="my_text" 
      type="LearningListItemNumbered" 
      @updateProps="updateProps($event)" 
      @deleteText="deleteComponent" />
  </template>
</template>

<script setup lang="ts">
import { useEditableText } from '@/composables/useEditableText';
import { defineProps } from 'vue';
import LearningBold from '../Highlight/LearningBold.vue';
import EditableText from '../EditableText.vue';


const props = defineProps({
  image: {
    type: String,
    default: null,
  },
  number: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
    default: '',
  }
});

const emit = defineEmits(['giveProps', 'signalDelete']); // Define emits
const { editable, my_text, updateProps, deleteComponent } 
  = useEditableText({ text: props.text || null }, emit)

</script>
