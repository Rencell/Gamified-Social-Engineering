<template>
  <div v-if="!editable">
    <!-- Quiz Images -->
    <div v-if="!toggle" class="flex flex-col gap-4 justify-center items-center">
      <!-- First Image -->
      <div>
        <p class="text-lg font-bold">{{ data?.Question }}</p>
      </div>
      <div :class="[data?.positionLeft ? 'flex-row w-2xl gap-4' : 'w-xl flex-col gap-4', 'flex']">
        <div @click="handleImageClick('image1')" :class="[
          'relative flex-1 bg-background rounded-xl cursor-pointer ',
          selectedImage === 'image1' ? 'border-3 border-b-5 border-green-500' : 'border-2 border-transparent hover:border-gray-400',
          selectedImage === 'image1' && selectedImage === data?.answer ? 'border-green-500' : 'border-red-500',
          selectedImage === 'image2' ? 'opacity-50' : ''
        ]">
          <img :src="useImageUrl(data?.image1)!" alt="Option 1" class="w-full rounded-lg animate-in" />
        </div>

        <!-- Second Image -->
        <div @click="handleImageClick('image2')" :class="[
          'relative flex-1 bg-background rounded-xl cursor-pointer ',
          selectedImage === 'image2' ? 'border-3 border-b-5' : 'border-2 border-transparent hover:border-gray-400 ',
          selectedImage === 'image2' && selectedImage === data?.answer ? 'border-green-500' : 'border-red-500',
          selectedImage === 'image1' ? 'opacity-50' : ''
        ]">
          <img :src="useImageUrl(data?.image2)!" alt="Option 2" class="w-full rounded-lg animate-in" />
        </div>
      </div>

      <div v-if="selectedImage" class="flex flex-col gap-4 animate-in fade-in">
        <div class="w-lg">
          <div class="mb-2">
            <span class="font-bold" :class="isCorrect ? 'text-green-500' : 'text-red-500'">{{ isCorrect ?
              'Correct!' : 'Incorrect' }}</span>
          </div>
          <div class="text-sm border-s-4 ps-4" :class="isCorrect ? 'border-green-500' : 'border-red-500'">
            <p>{{ explanation }}</p>
          </div>
        </div>

        <Button :class="[data?.positionLeft ? 'w-2xl gap-4' : 'w-xl']" class="border-b-4 border-primary/50"
          v-if="selectedImage" @click="gotoLesson">
          Reveal Why?
        </Button>
      </div>
    </div>

    <!-- Slot for Additional Content -->
    <div v-else>
      <slot name="lesson"></slot>

      <slot></slot>
    </div>
  </div>

  <div v-else>
    <div class="relative" v-if="!toggleEdit">
      <EditableCard class="border-l-purple-500" title="Two Image" :options="componentOptions" :item="item"
        :siblings="siblings" @deleteComponent="deleteComponent" @addComponent="handleAddComponent($event)"
        @reorder="reorderComponent($event)" />
      <Button @click="toggleEditFunc" size="sm" class="absolute -bottom-2 right-2">
        <Wrench />
      </Button>
    </div>
    <div v-else class="space-y-2">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 capitalize">Question</label>

        <Textarea class="min-h-[60px] resize-none" v-model="obj.Question" />

        <label class="block text-sm font-medium text-gray-700 capitalize">Explanation</label>
        <Textarea class="min-h-[60px] resize-none" v-model="obj.explanation" />

        <div class="flex gap-2">
          <Button size="sm" class="h-8" @click="updateProps({ data: obj })">
            <Check class="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" @click="toggleEditFunc" class="h-8 bg-transparent">
            <X class="w-3 h-3 mr-1" />
            Cancel
          </Button>
        </div>

        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center gap-2">
            Two Image Option
          </CardTitle>

        </div>

        <div class="flex gap-4 w-full mt-5">
          <div class="flex-1 cursor-pointer" @click="setCorrectAnswer('image1')">
            <Input type="file" class="mb-5" @change="image1.onFileChange" />
            <div class="py-10 rounded-2xl border-dashed border-4 transition-all flex justify-center items-center h-70"
              :class="{ 'border-accent': obj?.answer === 'image1' }">
              <img :src="image1.previewUrl.value || useImageUrl(obj?.image1) || '/Website.png'" alt=""
                class="h-full object-cover">
            </div>
            <p class="text-center mt-5" :class="obj?.answer === 'image1' ? 'brightness-100' : 'brightness-50'">Image 1
            </p>
          </div>
          <div class="flex-1 cursor-pointer" @click="setCorrectAnswer('image2')">
            <Input type="file" class="mb-5" @change="image2.onFileChange" />
            <div class="py-10 rounded-2xl border-dashed border-4 transition-all flex justify-center items-center h-70"
              :class="{ 'border-accent': obj?.answer === 'image2' }">
              <img :src="image2.previewUrl.value || useImageUrl(obj?.image2) || '/Website.png'" alt=""
                class="h-full object-cover">
            </div>
            <p class="text-center mt-5" :class="obj?.answer === 'image2' ? 'brightness-100' : 'brightness-50'">Image 2
            </p>
          </div>
        </div>
        <div class="flex justify-end mt-4"><Button @click="saveHandler"
            :disabled="!image1.changeUpdate.value && !image2.changeUpdate.value">Save Image</Button></div>


      </div>



    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useEditableText } from '@/composables/useEditableText';
import { computed, ref } from 'vue';
import EditableCard from '../Learning/EditableCard.vue';
import type { LearningType } from '../learningRegistry';
import type { Content } from '@/services/contentService';
import { Check, Wrench, X } from 'lucide-vue-next';
import { Textarea } from '@/components/ui/textarea';
import { useUploadContent } from '@/composables/useUploadContent';
import { useImageUrl } from '@/composables/useImageUrl';
import { Input } from '@/components/ui/input';

// Props for the two images
type Props = {
  Question: string;
  image1: string;
  image2: string;
  answer?: 'image1' | 'image2';
  explanation?: string;
  positionLeft?: boolean;
};

const props = defineProps<{
  data?: Props;
  item?: Content
  siblings?: Content[];
}>();

const obj = computed(() =>
  props.data ? { ...props.data } : {
    Question: 'New Question',
    image1: 'Image1.jpg',
    image2: 'Image2.jpg',
    answer: 'image1',
    explanation: 'explain',
    positionLeft: true
  }
);

const image1 = useUploadContent();
const image2 = useUploadContent();

const toggle = ref(false);
const toggleEdit = ref(false);
const toggleEditFunc = () => {
  toggleEdit.value = !toggleEdit.value;
};
// Emits an event when an image is selected
const emit = defineEmits(['imageSelected', 'showDown', 'addComponent', 'giveProps']);

// State to track the selected image
const selectedImage = ref<string | null>(null);

const isCorrect = ref(false);
const explanation = ref(obj.value?.explanation || 'Incorrect. Please try again.');
// Handles image selection
const handleImageClick = (image: string) => {

  if (selectedImage.value !== null) {
    return;
  }

  if (image === obj.value?.answer) {
    isCorrect.value = true;
  }

  selectedImage.value = image;
  emit('imageSelected', image); // Emit the selected image
};

const handleAddComponent = (type: LearningType) => {
  addComponent(type);
}

const gotoLesson = () => {
  toggle.value = true;
};

const componentOptions: { type: LearningType; label: string }[] = [
  { type: 'LearningSection', label: 'Section' },
];

function setCorrectAnswer(id: "image1" | "image2") {
  if (obj.value) {
    obj.value.answer = id;
  }
}

async function handleUploadImage1() {
  await image1.uploadImage(
    { item: { id: props.item?.id }, image: obj.value?.image1 },
    (data) => {
      if (obj.value) {
        obj.value.image1 = data.image;
      }
    }
  );

}

async function handleUploadImage2() {
  await image2.uploadImage(
    { item: { id: props.item?.id }, image: obj.value?.image2 },
    (data) => {
      if (obj.value) {
        obj.value.image2 = data.image;
      }
    }
  );
}

const saveHandler = async () => {
  await handleUploadImage1();
  await handleUploadImage2();
  updateProps({ data: obj.value });
}


const { editable, updateProps, deleteComponent, addComponent, reorderComponent }
  = useEditableText(null, emit)
</script>

<style scoped>
/* Add any additional styles here */
</style>