<template>
  <div class="snap-start min-h-screen flex flex-col items-center justify-center">
    <div v-if="editable" class="w-full ms-10 sm:p-0">
      <div class="flex gap-2 mb-5 text-sm items-center text-accent font-bold cursor-pointer"
        @click="editable = !editable">
        <ArrowLeft :size="15"></ArrowLeft> Back
      </div>
    </div>
    <slot></slot>
    <template v-if="useAuthStore().User.is_admin">
      <div v-if="!editable" class="absolute top-0 left-5 flex flex-col gap-2" @mouseenter="hover = true"
        @mouseleave="hover = false">
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" @click="editable = !editable" class="h-8 w-8 p-0">
            <Edit2 class="w-4 h-4 text-blue-500" />
          </Button>
          <transition name="fade">
  
            <span v-if="hover" class="transition-all">Click to edit</span>
          </transition>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" class="h-8 w-8 p-0" @click="contentStore.deleteContent(props.contentId!)">
            <Trash2 class="w-4 h-4 text-red-500" />
          </Button>
          <transition name="fade">
            <span v-if="hover" class="transition-all">Delete Content</span>
          </transition>
        </div>
        <div v-if="isLastContent" class="flex items-center gap-2">
          <Button variant="outline" size="sm" class="h-8 w-8 p-0" @click="contentStore.createContent()">
            <Plus class="w-4 h-4 text-green-500" />
          </Button>
          <transition name="fade">
            <span v-if="hover" class="transition-all">Add Content Below</span>
          </transition>
        </div>
        <div v-show="canMoveUp" class="flex items-center gap-2">
          <Button  @click="contentStore.handleReorderComponent(props.contentId!, 'up')" size="sm" variant="outline" class="size-8 p-0" title="Move Up">
            <ChevronUp class="w-4 h-4" />
          </Button>
          <transition name="fade">
            <span v-if="hover" class="transition-all">Move Down</span>
          </transition>
        </div>
        <div v-show="canMoveDown" class="flex items-center gap-2">
          <Button @click="contentStore.handleReorderComponent(props.contentId!, 'down')" size="sm" variant="outline" class="size-8 p-0" title="Move Up">
            <ChevronDown class="w-4 h-4" />
          </Button>
          <transition name="fade">
            <span v-if="hover" class="transition-all">Move Up</span>
          </transition>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, ChevronUp, Edit2, Plus, Trash2 } from 'lucide-vue-next';
import { computed, provide, ref } from 'vue';
import { useContentStore } from '@/stores/content';
import { useAuthStore } from '@/stores/auth';


const contentStore = useContentStore();
const props = defineProps<{
  toggleAddContent?: boolean
  contentId?: number | null
}>();

// Provide the `editable` property with a value of `true`
const editable = ref(false);
const hover = ref(false);
provide('editable', editable);

const isLastContent = computed(() => {
  if (!props.contentId) return false; // If no contentId is provided, return false
  const lastContentId = contentStore.contents[contentStore.contents.length - 1]?.id;
  return props.contentId === lastContentId;
});



const canMoveUp = computed(() => {
  const index = contentStore.components.findIndex(item => item.id === props.contentId);
  return index;
});

const canMoveDown = computed(() => {
  const index = contentStore.components.findIndex(item => item.id === props.contentId);
  return index >= 0 && index < contentStore.contents.length - 1;
});



</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>