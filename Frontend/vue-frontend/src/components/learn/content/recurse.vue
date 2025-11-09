<template>
  <component
    :is="componentMap[item.type]"
    v-bind="item.type === 'InteractiveMCQ' ? { mcq: item.props } : item.props"
    :item="item"
    :siblings="siblings"
    @signalDelete="handleDeleteComponent(item.id)"
    @addComponent="handleAddComponent($event, item.id)"
  >
    <template v-if="item.children && item.children.length">
      <template v-for="child in item.children" :key="child.id">
      <recurse
        :item="child"
        :siblings="item.children"
        :component-map="componentMap"
        @giveProps="handleTextUpdate(child.id, $event)"
        @moveOrder="handleReorderComponent(child.id, $event)"
        @onUpdate="handleTextUpdate"
        @onDelete="handleDeleteComponent"
        @onCreate="handleAddComponent"
        @onReorder="handleReorderComponent"
      />

    </template>
      
    </template>
  </component>

</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { LearningType } from './UI/learningRegistry';
import type { Content } from '@/services/contentService';
const emit = defineEmits(['onUpdate', 'onDelete', 'onCreate', 'onReorder']);


const handleTextUpdate = (id: number, $event: string) => {
  emit('onUpdate', id, $event); 
};

const handleDeleteComponent = (id: number) => {
  emit('onDelete', id); 
};

const handleAddComponent = (type: LearningType, parentId: number | null) => {
  emit("onCreate", type, parentId);
};

const handleReorderComponent = (id: number, direction: 'up' | 'down') => {
  emit('onReorder', id, direction);
};

interface ContentItem {
  id: number;
  type: string;
  props: Record<string, any>;
  item_order: number;
  content: number;
  parent: number | null;
  children?: ContentItem[];
}

const props = defineProps<{
  item: Content;
  siblings: Content[];
  componentMap: Record<string, any>;
}>();

</script>