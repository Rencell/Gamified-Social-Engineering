<template>
  <div class="group relative">
    
    <div v-if="!editMode" class="cursor-pointer hover:bg-background/50 rounded-lg p-2 -m-1 transition-colors"
      @click="toggleEdit">
      <p class="rounded-xl p-1 px-2 bg-red text-xs bg-accent w-fit font-bold mb-2">{{ type }}</p>
      <LearningTextFormat :text="text" />
    </div>
    <div v-else class="space-y-2">
      <div v-for="(value, key) in editableProps" :key="key" class="space-y-2">
        <label :for="key" class="block text-sm font-medium text-gray-700 capitalize">{{ key }}</label>
        <Select v-if="props.type in PropsMultiSelector && key in PropsMultiSelector[props.type]"
          v-model="editableProps[key]" class="w-full">
          <SelectTrigger>
            <SelectValue :placeholder="'Select ' + key" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{{ key }}</SelectLabel> 
              <SelectItem v-for="option in PropsMultiSelector[props.type][key].options" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <!-- Render a textarea for all other keys -->
        <template v-else>
          <Textarea v-if="typeof value === 'string'" v-model="editableProps[key]" :id="key"
            class="min-h-[60px] resize-none" :placeholder="'Enter ' + key + '...'" />

          <template v-else-if="Array.isArray(editableProps[key])">
            <Textarea v-for="(val, index) in editableProps[key]" :key="index" v-model="editableProps[key][index].text"
              :id="key" class="ms-5 min-h-[60px] resize-none" :placeholder="'Enter ' + key + '...'" />
          </template>

        </template>

      </div>
      <div class="flex gap-2">
        <Button size="sm" class="h-8" @click="saveProps">
          <Check class="w-3 h-3 mr-1" />
          Save
        </Button>
        <Button size="sm" variant="outline" @click="toggleEdit" class="h-8 bg-transparent">
          <X class="w-3 h-3 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
    <div class="absolute -right-2 -top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

      <Button v-show="canMoveUp" size="sm" variant="ghost" class="h-6 w-6 p-0"
        title="Move Up" @click="emit('reorder', 'up')"
        >
        <ChevronUp class="w-3 h-3" />
      </Button>
      <Button v-show="canMoveDown" size="sm" variant="ghost" class="h-6 w-6 p-0"
        title="Move Down" @click="emit('reorder', 'down')"
        >
        <ChevronDown class="w-3 h-3" />
      </Button>
      
      <Button size="sm" variant="ghost" class="h-6 w-6 p-0" @click="deleteComponent">
        <Trash2 class="w-4 h-4" color="red" />
      </Button>
    </div>
  </div>

</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Trash2, ChevronUp, ChevronDown } from 'lucide-vue-next';
import LearningTextFormat from './Highlight/LearningBold.vue';
import { defaultPropsMap, PropsMultiSelector } from '../learningRegistry';
import type { LearningType } from '../learningRegistry';
import type { Content } from '@/services/contentService';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const emit = defineEmits(['updateProps', 'deleteText', 'reorder']);


type FlexibleProps = {
  text: string
} & Record<string, any>


const props = defineProps({
  type: {
    type: String as PropType<LearningType>,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  props: {
    type: Object as PropType<FlexibleProps>,
    required: true,
  },
  item: {
    type: Object as PropType<Content>,
    required: false,
  },
  siblings: {
    type: Array as PropType<Content[]>,  
    required: false,
  },
});

const canMoveUp = computed(() => {
  if (!props.item || !props.siblings) return false;
  const index = props.siblings.findIndex(sib => sib.id === props.item?.id);
  return index > 0;
});

const canMoveDown = computed(() => {
  if (!props.item || !props.siblings) return false;
  const index = props.siblings.findIndex(sib => sib.id === props.item?.id);
  return index < props.siblings.length - 1;
});

const defaultProps = defaultPropsMap[props.type] || {};
const editableProps = ref({ ...defaultProps, ...props.props });

const editMode = ref(false);

const toggleEdit = () => {
  editMode.value = !editMode.value;
};

// Save the updated props and emit them
const saveProps = () => {
  emit('updateProps', editableProps.value);
  toggleEdit();
};

const deleteComponent = () => {
  emit('deleteText');
};

</script>