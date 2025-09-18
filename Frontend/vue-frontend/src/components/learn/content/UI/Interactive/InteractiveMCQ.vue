<script setup lang="ts">
import { ref, computed } from 'vue';
import type { MCQ } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LearningImage2 from '../Learning/Image/LearningImage2.vue';
import { useEditableText } from '@/composables/useEditableText';
import EditableText from '../Learning/EditableText.vue'
import EditableInteractive from '../Learning/EditableInteractive.vue'
import type { Content } from '@/services/contentService';




const props = defineProps<{
  mcq: MCQ;
  image?: string | null;
  item?: Content
  siblings?: Content[];
}>();

const selectedAnswer = ref<string | null>(null);
const showResult = ref(false);
const isAnswered = ref(false);
const isSubmitting = ref(false); // New state to disable buttons temporarily

const handleAnswerSelect = (optionId: string) => {
  if (showResult.value) return;
  selectedAnswer.value = optionId;
};

const handleSubmit = () => {
  if (selectedAnswer.value) {
    isSubmitting.value = true; // Disable buttons
    setTimeout(() => {
      showResult.value = true; // Show result after 1 second
      isSubmitting.value = false; // Re-enable buttons
      emit('showDown');
    }, 1000); // 1-second delay
  }
};

const handleContinue = () => {
  isAnswered.value = true;
};

const isCorrect = computed(() => {
  return selectedAnswer.value === props.mcq.answer;
});

const emit = defineEmits(['showDown', 'giveProps', 'signalDelete', "addComponent", "moveOrder"]);
const { editable, my_text, updateProps, deleteComponent, addComponent, reorderComponent }
  = useEditableText({ question: props.mcq.question, options: props.mcq.options, answer: props.mcq.answer }, emit)


</script>

<template>
  <div v-if="!editable" class="space-y-5">
    <div v-if="!isAnswered" class="space-y-5 pb-20">
      <LearningImage2 v-if="props.image" :image="props.image" />
      <p class="font-bold text-lg">{{ mcq.question }}</p>

      <div class="space-y-3">
        <Card v-for="option in mcq.options" :key="option.id" @click="handleAnswerSelect(option.id)" :class="[
          'hover:bg-background/30 border-2 border-b-4 cursor-pointer',
          selectedAnswer === option.id ? 'border-white/80' : 'border-ternary/40',
          showResult && option.id === mcq.answer ? 'border-green-500' : '',
          showResult && selectedAnswer === option.id && !isCorrect ? 'border-red-500' : ''
        ]">
          <CardContent class="flex gap-3 items-center">
            <div>
              <p class="w-10 h-10 text-xs bg-ternary rounded-full flex justify-center items-center">
                {{ option.id }}
              </p>
            </div>
            <p class="font-bold text-lg text-white/70">{{ option.text }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Buttons for "How sure are you?" -->
      <div v-show="selectedAnswer && !showResult" class="flex gap-3 justify-end items-center">
        <p>How sure are you?</p>
        <Button size="lg" @click="handleSubmit" class="border-b-4 border-primary/30" :disabled="isSubmitting">
          Somewhat
        </Button>
        <Button size="lg" @click="handleSubmit" class="border-b-4 border-primary/30" :disabled="isSubmitting">
          Very
        </Button>
      </div>

      <!-- Show result -->
      <div v-if="showResult">
        <Button v-if="!isCorrect" variant="destructive" size="lg" @click="handleContinue"
          class="w-full mt-4 border-b-4 border-primary/30">
          Show Why
        </Button>
        <Button v-else size="lg" @click="handleContinue"
          class="bg-green-500/50 w-full mt-4 border-b-4 border-primary/30">
          Show Why
        </Button>
      </div>
    </div>

    <div v-else>
      <slot name="lesson"></slot>
      <slot></slot>
    </div>
  </div>

  <template v-else>
    <EditableInteractive 
      type="InteractiveMCQ" 
      :props="my_text"
      :item="item"
      :siblings="siblings"
      @updateProps="updateProps($event)"
      @signalDelete="deleteComponent" 
      @addComponent="addComponent"
      @moveOrder="reorderComponent($event)" />
    <slot></slot>
  </template>


</template>
