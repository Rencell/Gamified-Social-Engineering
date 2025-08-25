<template>
  <div>
    <!-- Quiz Images -->
    <div v-if="!toggle" class="flex flex-col gap-4 justify-center items-center">
      <!-- First Image -->
      <div>
        <p class="text-lg font-bold">{{ Question }}</p>
      </div>
      <div @click="handleImageClick('image1')" :class="[
        'relative w-lg bg-background rounded-xl cursor-pointer ',
        selectedImage === 'image1' ? 'border-3 border-b-5 border-green-500' : 'border-2 border-transparent hover:border-gray-400',
        selectedImage === 'image1' && selectedImage === answer ? 'border-green-500' : 'border-red-500',
        selectedImage === 'image2' ? 'opacity-50' : ''
      ]">
        <img :src="image1" alt="Option 1" class="w-full rounded-lg animate-in" />
      </div>

      <!-- Second Image -->
      <div @click="handleImageClick('image2')" :class="[
        'relative w-lg bg-background rounded-xl cursor-pointer ',
        selectedImage === 'image2' ? 'border-3 border-b-5' : 'border-2 border-transparent hover:border-gray-400 ',
        selectedImage === 'image2' && selectedImage === answer ? 'border-green-500' : 'border-red-500',
        selectedImage === 'image1' ? 'opacity-50' : ''
      ]">
        <img :src="image2" alt="Option 2" class="w-full rounded-lg animate-in" />
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
  
        <Button class="w-lg border-b-4 border-primary/50" v-if="selectedImage" @click="gotoLesson">
          Continue
        </Button>
      </div>
    </div>

    <!-- Slot for Additional Content -->
    <div v-else>
      <slot name="lesson"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ref } from 'vue';

// Props for the two images
const props = defineProps<{
  Question: string;
  image1: string;
  image2: string;
  answer?: 'image1' | 'image2';
  correctExplanation?: string;
  incorrectExplanation?: string;
}>();

const toggle = ref(false);
// Emits an event when an image is selected
const emit = defineEmits(['imageSelected', 'showDown']);

// State to track the selected image
const selectedImage = ref<string | null>(null);

const isCorrect = ref(false);
const explanation = ref(props.incorrectExplanation || 'Incorrect. Please try again.');
// Handles image selection
const handleImageClick = (image: string) => {

  if (selectedImage.value !== null) {
    return;
  }

  if(image === props.answer) {
    isCorrect.value = true;
    explanation.value = props.correctExplanation || 'Correct! This is the right choice.';
  }

  selectedImage.value = image;
  emit('imageSelected', image); // Emit the selected image
};

const gotoLesson = () => {
  toggle.value = true;
  emit('showDown');
};
</script>

<style scoped>
/* Add any additional styles here */
</style>