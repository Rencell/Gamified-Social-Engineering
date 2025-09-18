<template>
  <div v-if="editable" class="mb-4">
    <Card>
      <CardContent class="flex justify-between">
        <div>
          <Button v-show="canMoveUp" size="sm" variant="ghost" class="h-6 w-6 p-0" title="Move Up"
            @click="reorderComponent('up')">
            <ChevronUp class="w-3 h-3" />
          </Button>
          <Button v-show="canMoveDown" size="sm" variant="ghost" class="h-6 w-6 p-0" title="Move Down"
            @click="reorderComponent('down')">
            <ChevronDown class="w-3 h-3" />
          </Button>

          <Button size="sm" variant="ghost" class="h-6 w-6 p-0" @click="deleteComponent">
            <Trash2 class="w-4 h-4" color="red" />
          </Button>
        </div>

        <div>
          <Button variant="ghost" @click="pushList">
            <PlusCircle></PlusCircle>List
          </Button>
          <Button @click="updateProps({ data: obj })">
            <Save></Save>Save
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>


  <div @click="showExample[index] = !showExample[index]" :class="showExample[index] ? '' : 'hover:scale-102'"
    class="flex flex-col gap-3 rounded-sm border-[0.5px] border-ternary/50 bg-secondary duration-100 ease-in hover:shadow-lg pb-5 cursor-pointer"
    v-for="(value, index) in obj" :key="index">

    <div @click="showExample[index] = showExample[index]" class="flex items-center justify-between p-5 py-8">
      <div class="flex gap-4">
        <Button v-if="editable" size="icon" variant="ghost" class="text-red-500" @click.stop="deleteList(index)"><Trash2></Trash2></Button>
        <div class="box-content w-10 rounded-full bg-accent/50 p-2">
          <img class="w-fit" :src="value.image" alt="" />
          <Input v-if="editable" type="file" class="opacity-0" @click.stop></Input>
        </div>
        <div class="flex flex-col gap-2">
          <p v-if="!editable" class="font-secondary text-xl font-bold">{{ value.heading }}</p>
          <Input v-else v-model="value.heading" @click.stop></Input>
          <i v-if="!editable" class="text-sm">
            {{ value.subheading }}
          </i>
          <Input v-else v-model="value.subheading" @click.stop></Input>
        </div>
      </div>

      <div class="text-center">
        <button @click="showExample[index] = showExample[index]"
          class="bg-accent rounded-full p-1 px-3 text-xs font-semibold text-white transition">
          <div v-if="!showExample[index]">
            Expand<i class="bi bi-arrow-down-short"></i>
          </div>
          <div v-else>Collapse<i class="bi bi-arrow-up-short"></i></div>
        </button>
      </div>
    </div>
    <div :class="{ 'animate': !showExample[index] }" class="motion-preset-slide-down px-23">
      <h1 class="font-secondary mb-4 text-xs font-semibold text-gray-400">
        WHAT IS THIS?
      </h1>
      <p v-if="!editable" class="font-secondary mb-7 text-sm/loose text-white-800">
        {{ value.description }}
      </p>
      <Textarea v-else v-model="value.description" @click.stop></Textarea>
      <h1 class="font-secondary mb-4 text-xs font-semibold text-gray-400"
        v-if="value.examples && value.examples.length > 0">
        SOME OF EXAMPLE/S
      </h1>

      <Button v-if="editable" size="sm" class="mb-4"
        @click.stop="value.examples.push({ example: 'Example', image: '' })">
        <Plus />Add Example
      </Button>
      <description-examples v-for="(value2, index) in value.examples" :key="index" :index="index + 1"
        v-model="value2.example" :image="value2.image" />
      <h1 class="font-secondary mb-4 text-xs font-semibold text-gray-400">
        TYPICAL SIGNS OF {{ value.heading.toUpperCase() }}
      </h1>
      <Button v-if="editable" size="sm" class="mb-4" @click.stop="value.signs.push('another sign')">
        <Plus />Add Signs
      </Button>
      <div class="font-secondary ms-4">
        <ul class="list-disc text-sm flex flex-col gap-2">

          <li v-for="(valueSign, index) in value.signs" :key="index">
            <p v-if="!editable">{{ valueSign }}</p>
            <Input v-else v-model="value.signs[index]" @click.stop></Input>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">

import type { DescriptionData } from './type';
import { computed, ref } from "vue";
import DescriptionExamples from './description-examples.vue'
import { useEditableText } from '@/composables/useEditableText';
import type { Content } from '@/services/contentService';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Button from '@/components/ui/button/Button.vue';
import { ChevronDown, ChevronUp, Plus, PlusCircle, Save, Trash2 } from 'lucide-vue-next';
import { Card, CardContent } from '@/components/ui/card';

const props = defineProps<{
  data: DescriptionData[];
  item?: Content,
  siblings?: Content[]

}>();

const obj = ref(props.data)

const pushList = () => {
  if (props.data) {
    obj.value.push(
      {
        heading: "New Heading",
        subheading: "New Subheading",
        image: "New Image",
        description: "New Description",
        examples: [
          { example: "Example 1", image: "ExampleImage1.jpg" },
          { example: "Example 2", image: "ExampleImage2.jpg" }
        ],
        signs: ["Sign 1", "Sign 2"]
      }
    );
  }
}

const deleteList = (index: number) => {
    if(obj.value && index > 0) {

      obj.value.splice(index, 1);
    } 
}


const showExample = ref(<boolean[]>[false]);

const emit = defineEmits(['giveProps', 'signalDelete', 'moveOrder']);
const { editable, updateProps, deleteComponent, reorderComponent }
  = useEditableText({ data: props.data }, emit)


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

<style scoped>
@keyframes fade-out {
  from {
    display: block;
    max-height: 1000px;
  }

  to {
    display: none;
    max-height: 0;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
}

.animate {
  animation: fade-out 0.2s ease-out forwards;
  overflow: hidden;
}

.animate>* {
  opacity: 0;
}
</style>
