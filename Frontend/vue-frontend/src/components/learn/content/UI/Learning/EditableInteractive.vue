<template>
    <div class="group relative">
        <div v-if="!editMode" class="cursor-pointer rounded-lg p-2 -m-1 transition-colors relative">
            <EditableCard 
                class="border-l-red-500"
                title="Interactive" 
                :options="componentOptions"
                :item="item" 
                :siblings="siblings"
                @deleteComponent="deleteComponent" 
                @addComponent="handleAddComponent"
                @reorder="reorderComponent($event)" />
            <Button @click="toggleEdit" size="sm" class="absolute bottom-0 right-0">
                <Wrench />
            </Button>
        </div>
        <div v-else class="space-y-2">
            <div v-for="(value, key) in editableProps" :key="key" class="space-y-2">
                <label :for="key" class="block text-sm font-medium text-gray-700 capitalize">{{ key }}</label>

                <!-- Render a textarea for all other keys -->
                <Textarea v-if="typeof value === 'string'" v-model="editableProps[key]" :id="key"
                    class="min-h-[60px] resize-none" :placeholder="'Enter ' + key + '...'" />

                <template v-else-if="Array.isArray(editableProps[key])">

                    <div v-for="(val, index) in editableProps[key] as MCQOption[]" :key="val.id" class="flex items-start gap-2">
                        <span class="mt-2 font-mono text-sm text-muted-foreground">{{ val.id }}.</span>
                        <Textarea v-model="editableProps[key][index].text" :id="key" class="ms-5 min-h-[60px] resize-none flex-1"
                            :placeholder="'Enter option text...'" />
                        <Button size="sm" variant="outline" class="h-8 mt-2" @click="editableProps[key].splice(index, 1)">
                            <Trash2 class="w-4 h-4" />
                        </Button>
                        
                    </div>
                    <Button size="sm" @click="addOption(editableProps[key][(editableProps[key] as any[]).length - 1].id)">Add Option</Button>

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
        <!-- <div class="absolute -right-2 -top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" class="h-6 w-6 p-0" @click="deleteComponentText">
                <Trash2 class="w-4 h-4" color="red" />
            </Button>
        </div> -->
    </div>

</template>

<script setup lang="ts">
import { ref, Text, type PropType } from 'vue';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Trash2, Edit2, Plus, Wrench } from 'lucide-vue-next';
import LearningTextFormat from './Highlight/LearningBold.vue';
import { defaultPropsMap, PropsMultiSelector } from '../learningRegistry';
import type { LearningType } from '../learningRegistry';
import { Card } from '@/components/ui/card';
import type { MCQOption } from '../learningRegistry';
import EditableCard from './EditableCard.vue'
import { useEditableText } from '@/composables/useEditableText';
import type { Content } from '@/services/contentService';

const emit = defineEmits(['updateProps', 'signalDelete', "addComponent", "moveOrder"]);


type FlexibleProps = Record<string, any>;


const props = defineProps({
    type: {
        type: String as PropType<LearningType>,
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

const showAddComponents = ref(false);
const defaultProps = defaultPropsMap[props.type] || {};
const editableProps = ref<Record<string, any>>({ ...defaultProps, ...props.props });

const editMode = ref(false);


const handleAddComponent = (type: LearningType) => {
    emit("addComponent", type);
    showAddComponents.value = true;
}

const addOption = (id: string) => {
  const nextId = String.fromCharCode(id.charCodeAt(0) + 1);
  editableProps.value.options.push({ id: nextId, text: 'Another' });
};

const toggleEdit = () => {
    editMode.value = !editMode.value;
};

// Save the updated props and emit them
const saveProps = () => {
    emit('updateProps', editableProps.value);
    toggleEdit();
};


const componentOptions: { type: LearningType; label: string }[] = [
  { type: 'LearningSection', label: 'Section' },
];

const { deleteComponent, reorderComponent } = useEditableText(null,emit)

</script>