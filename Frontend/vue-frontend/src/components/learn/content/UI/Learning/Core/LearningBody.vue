<template>
  <div class="mb-3 text-[1rem]/loose font-medium ">
    
    <template v-if="!editable">
      <slot></slot>
      <LearningBold :text="my_text.text" />
    </template>

    <template v-else>
      <editable-text 
        :text="my_text.text" 
        :props="my_text"
        :item="item"
        :siblings="siblings" 
        type="LearningBody" 
        @updateProps="updateProps($event)" 
        @deleteText="deleteComponent"
        @reorder="reorderComponent($event)" 
         />
    </template>

    
    
  </div>
</template>

<script setup lang="ts">
import EditableText from '../EditableText.vue'
import LearningBold from '../Highlight/LearningBold.vue';
import { useEditableText } from '@/composables/useEditableText';
import type { Content } from '@/services/contentService';

interface Props {
  customClass?: string | string[] | Record<string, boolean>
  text?: string
  item?: Content
  siblings?: Content[]
}



const props = defineProps<Props>()
const emit = defineEmits(['giveProps', 'signalDelete', 'moveOrder']);
const { editable, my_text, updateProps, deleteComponent, reorderComponent } 
  = useEditableText({ text: props.text}, emit)


</script>