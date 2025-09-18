<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import Card from '@/components/ui/card/Card.vue';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-vue-next';
import type { Content } from '@/services/contentService';

const showAddComponents = ref(false);

const props = defineProps({
    title: {
        type: String,
        default: 'Section',
    },
    options: {
        type: Array as () => { type: string; label: string }[],
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

const emit = defineEmits(['addComponent', 'deleteComponent', 'reorder']);

const handleAdd = (type: string) => {
    emit('addComponent', type);
};

const deleteComponent = () => {
    emit('deleteComponent');
};


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
</script>

<template>
    <Card class="p-4 border-l-4 border-l-blue-500 group relative mb-4" >
        <div
            class="text-sm text-muted-foreground mb-2 hover:text-foreground transition-colors flex justify-between "
            >
            <p class="cursor-pointer" @click="showAddComponents = !showAddComponents">{{ title }} {{ showAddComponents ? "(Click to hide options)" : "(Click to add components)" }}</p>


        </div>

        <div v-if="showAddComponents"
            class="mb-4 p-3 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30">
            <p class="text-sm text-muted-foreground mb-2">Add to this section:</p>
            <div class="flex gap-2 flex-wrap">
                <Button v-for="option in options" :key="option.type" size="sm" class="flex items-center gap-1 h-8"
                    @click="handleAdd(option.type)">
                    <Plus class="w-3 h-3" />
                    {{ option.label }}
                </Button>
            </div>
        </div>

        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button v-show="canMoveUp" size="sm" variant="ghost" class="h-6 w-6 p-0" title="Move Up"
                @click="emit('reorder', 'up')">
                <ChevronUp class="w-3 h-3" />
            </Button>
            <Button v-show="canMoveDown" size="sm" variant="ghost" class="h-6 w-6 p-0" title="Move Down"
                @click="emit('reorder', 'down')">
                <ChevronDown class="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" class="h-6 w-6 p-0 text-destructive hover:text-destructive"
                @click="deleteComponent">
                <Trash2 class="w-4 h-4" />
            </Button>
        </div>
    </Card>

</template>