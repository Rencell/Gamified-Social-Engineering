<template>
  <div class="snap-center min-h-screen flex flex-col items-center justify-center">
    <div class="p-8 bg-secondary rounded-lg w-lg">
      <h2 class="text-lg font-bold mb-4">{{ quiz.question }}</h2>
      <hr class="border-accent">
      <br>
      <div class="flex flex-col gap-4 p-5">
        <label v-for="(option, index) in quiz.options" :key="index" :for="'option-' + index"
          class="flex items-center p-4 border-1 rounded-lg cursor-pointer hover:bg-accent/30 hover:border-accent transition-colors duration-200">
          <input type="checkbox" :id="'option-' + index" :value="option" v-model="selectedOptions"
            class="w-4 h-4 text-blue-600 bg-background border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
          <span class="ml-4 text-sm font-medium">{{ option }}</span>
        </label>
      </div>
      <div class="flex w-full">
        
        <Button class="mx-auto rounded-full mt-10" size="lg" @click="submitQuiz">Submit</Button>
      </div>
      <div v-if="showResult" class="mt-4">
        <p v-if="isCorrect" class="text-green-500">Correct!</p>
        <p v-else class="text-red-500">Incorrect. Please try again.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/ui/button/Button.vue';

const quiz = {
  question: 'Which psychological principle is being used when a social engineer creates a sense of urgency to manipulate a victim into acting quickly without thinking?',
  options: ['Trust', 'Curiosity', 'Urgency', 'Fear'],
  correctAnswer: ['Trust', 'Curiosity', 'Urgency', 'Fear']
};

const selectedOptions = ref<string[]>([]);
const showResult = ref(false);
const isCorrect = ref(false);

const arraysMatch = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  console.log(a, b);
  return a.every((val: string, index: number) => val === b[index]);
};


const submitQuiz = () => {
  showResult.value = true;
  isCorrect.value = arraysMatch(selectedOptions.value, quiz.correctAnswer);
};
</script>
