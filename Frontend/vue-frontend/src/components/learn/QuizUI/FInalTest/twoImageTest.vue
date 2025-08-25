<template>
  <div>
    <!-- Quiz Images -->
    <div class="flex flex-col gap-4 justify-center items-center mb-15">
      <!-- First Image -->
      <div>
        <Typewriter :text="Question.Question" @animationEnd="onAnimationEnd = true" :delay="20"
          class="text-lg font-bold" />
      </div>
      <div v-show="onAnimationEnd" @click="handleImageClick('image1')" :class="[
        'relative w-md bg-background rounded-xl cursor-pointer ',
        selectedImage === 'image1' ? 'border-3 border-b-5 border-green-500' : 'border-2 border-transparent hover:border-gray-400',
        selectedImage === 'image1' && selectedImage === Question.answer ? 'border-green-500' : 'border-red-500',
        selectedImage === 'image2' ? 'opacity-50' : '',
        onAnimationEnd ? 'animate-in fade-in duration-500' : 'opacity-0'
      ]">
        <img :src="Question.image1" alt="Option 1" class="w-full rounded-lg animate-in" />
      </div>

      <!-- Second Image -->
      <div v-show="onAnimationEnd" @click="handleImageClick('image2')" :class="[
        'relative w-md bg-background rounded-xl cursor-pointer ',
        selectedImage === 'image2' ? 'border-3 border-b-5' : 'border-2 border-transparent hover:border-gray-400 ',
        selectedImage === 'image2' && selectedImage === Question.answer ? 'border-green-500' : 'border-red-500',
        selectedImage === 'image1' ? 'opacity-50' : '',
        onAnimationEnd ? 'animate-in fade-in duration-500' : 'opacity-0'
      ]">
        <img :src="Question.image2" alt="Option 2" class="w-full rounded-lg animate-in" />
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ref } from 'vue';
import type { TwoImage } from './type';
import { Typewriter } from '@/components/ui/typewriter';
// Props for the two images
const props = defineProps<{
  Question: TwoImage;
}>();

const onAnimationEnd = ref(false)

const loading = ref(false);
const emit = defineEmits(['isAnswered', 'addScore', 'isCorrect']);

const selectedImage = ref<string | null>(null);

const isCorrect = ref(false);
const handleImageClick = (image: string) => {

  setTimeout(() => {
    
    if (selectedImage.value !== null) {
      return;
    }
  
    if (image === props.Question.answer) {
      isCorrect.value = true;
      emit('addScore');
    }
    emit('isAnswered', true);
    emit('isCorrect', isCorrect.value);
    selectedImage.value = image;
  }, 1000);
};

</script>

<style scoped>
/* Add any additional styles here */
</style>