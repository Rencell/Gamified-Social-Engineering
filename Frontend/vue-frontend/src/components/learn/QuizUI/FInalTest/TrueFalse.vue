<template>
  <div class="flex flex-col items-center gap-15">
    <!-- Question Image -->
    <LearningImage :image="useImageUrl(Question.image) as string" />

    <!-- Question and Choices -->
    <div>
      <div class="w-lg flex flex-col gap-7">
        <!-- Question Text -->
        <Typewriter :text="Question.question" @animation-end="animationEnd = true" :delay="20"
          class="font-semibold text-2xl font-sans" />

        <!-- Choices -->
        <div class="space-y-3" :class="animationEnd ? 'animate-in fade-in duration-500' : 'opacity-0'">
          <Card v-for="(choice, index) in ['True', 'False']" :key="index" :class="[
            'hover:bg-background/30 border-2 border-b-4 cursor-pointer',
            selectedAnswer === choice && !isAnswered
              ? 'border-white/80'
              : 'border-ternary/40',
            Question.answer === choice && isAnswered && selectedAnswer === choice
              ? 'border-green-500'
              : '',
            Question.answer !== choice && isAnswered && selectedAnswer === choice
              ? 'border-red-500'
              : ''
          ]" @click="handleAnswerSelect(choice)">
            <CardContent class="flex gap-3 items-center">
              <div>
                <p
                  class="w-7 h-7 text-xs text-ternary font-bold bg-primary rounded-full flex justify-center items-center">
                  {{ choice === 'True' ? 'T' : 'F' }}
                </p>
              </div>
              <p class="font-bold text-lg text-white/70">
                {{ choice }}
              </p>
            </CardContent>
          </Card>
        </div>

        <Button v-if="showContinue && !isAnswered" :disabled="loading" class="mt-4 border-primary/50"
          @click="handleSubmit">
          Continue
        </Button>

        <!-- Feedback Section -->
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { Typewriter } from '@/components/ui/typewriter';
import LearningImage from '../../content/UI/Learning/Image/LearningImage.vue';
import type { TrueFalse } from './type';
import { ref, computed } from 'vue';
import { Card } from '@/components/ui/card';
import CardContent from '@/components/ui/card/CardContent.vue';
import { Button } from '@/components/ui/button';
import { useImageUrl } from '@/composables/useImageUrl';

// Props
const props = defineProps<{
  Question: TrueFalse;
}>();

// Emits
const emit = defineEmits(['isAnswered', 'addScore', 'isCorrect']);

// State
const animationEnd = ref(false);
const isAnswered = ref(false);
const selectedAnswer = ref<string | null>(null);

const showContinue = ref(false);
// Computed Property to Check Correctness
const isCorrect = computed(() => selectedAnswer.value === props.Question.answer);

// Handle Answer Selection
const handleAnswerSelect = (choice: string) => {

  if (isAnswered.value) return;
  selectedAnswer.value = choice;
  showContinue.value = true;
};


const loading = ref(false);
const handleSubmit = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    isAnswered.value = true;
    emit('isAnswered', true);
    emit('isCorrect', isCorrect.value);
    showContinue.value = true;
    if (isCorrect.value) {
      emit('addScore');
    }
  }, 1000);

};



</script>

<style scoped>
/* Add any additional styles here */
</style>