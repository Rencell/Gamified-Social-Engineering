<template>
  <div class="min-h-screen text-white p-4 w-xl">
    <!-- Header -->
    <Timer ref="timerRef" @time-up="toggleFinish($event)" />

    <div class="text-center mb-4">
      <div v-if="!loading" class="text-xl font-bold">
        Score: <span class="text-blue-400">{{ score }}</span>
      </div>

      <div v-else class="flex items-center justify-center gap-3">
        <div class="inline-block">
          <Spinner size="lg"></Spinner>
        </div>
        <p class="font-bold text-lg">Evaluating...</p>
      </div>
    </div>

    <!-- Title -->
    <h1 class="text-2xl font-bold mb-8 text-center">Tap the matching pairs</h1>

    <!-- Game Area -->
    <div :class="{ 'animate-pulse [animation-duration:1.5s]': loading }"
      class="flex justify-center gap-4 max-w-xl mx-auto mb-8">
      <div class="w-1/2 grid gap-4">
        <button v-for="(word, index) in shuffledWords" :key="index"
          :disabled="hasSelected && selectedCardA !== word.match_A" :class="[
            'p-4 rounded-xl border-2 transition-all duration-200 min-h-[80px]',
            'flex items-center justify-center text-center font-medium cursor-pointer',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            getCardStyle(word.match_A),
          ]" @click="handleCardClick(word.match_A, 'a')">
          {{ word.match_A }}
        </button>
      </div>
      <div class="w-1/2 grid gap-4">
        <button v-for="(word, index) in shuffledWords" :key="index"
          :disabled="hasSelected && selectedCardB !== word.match_B" :class="[
            'p-4 rounded-xl border-2 transition-all duration-200 min-h-[80px]',
            'flex items-center justify-center text-center font-medium cursor-pointer',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            getCardStyle(word.match_B),
          ]" @click="handleCardClick(word.match_B, 'b')">
          {{ word.match_B }}
        </button>
      </div>
    </div>
    
    <!-- Continue Button -->
    <div class="flex justify-center max-w-xl mx-auto">
      <Button size="lg" class="w-full border-b-4 border-primary/40" :disabled="!gameCompleted" @click="toggleFinish(timerRef?.timeLeft || 0)">
        Continue 
      </Button>
    </div>

    <div v-if="gameCompleted" class="text-center mt-4">
      <div class="text-green-400 font-semibold text-lg">
        🎉 Great job! All pairs matched!
      </div>
      <div class="text-sm mt-2">
        Final Score: <span class="text-blue-400">{{ score }}</span>
        {{ score === 50
          ? " - Perfect!"
          : score > 0
            ? " - Good job!"
            : " - Keep practicing!" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import type { WordPair } from './type';
import { Spinner } from '@/components/ui/spinner';
import Timer from '../timer.vue'

defineOptions({
  name: 'MatchingQuiz',
});

const props = defineProps<{
  questions: WordPair[];
}>();

const emit = defineEmits(['finish']);

const timerRef = ref<InstanceType<typeof Timer> | null>(null);
const wordPairs: WordPair[] = props.questions;
const selectedCardA = ref<string | null>(null);
const selectedCardB = ref<string | null>(null);
const error = ref(false);
const gameCompleted = ref(false);
const loading = ref(false);
const matchedPairs = ref<string[]>([]);
const shuffledWords = ref<WordPair[]>([]);
const score = ref(0);

const hasSelected = computed(
  () => selectedCardA.value !== null && selectedCardB.value !== null
);

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;
  const arr = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
}

const toggleFinish = (time: number) => {
  gameCompleted.value = true;
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    emit('finish', score.value, time);
  }, 5000);
};

const shufflePairs = (pairs: WordPair[]) => {
  // Separate lists
  const match_AWords = pairs.map((p) => p.match_A);
  const match_BWords = pairs.map((p) => p.match_B);

  const shuffledmatch_A = shuffle(match_AWords);
  const shuffledmatch_B = shuffle(match_BWords);

  const mixedPairs = shuffledmatch_A.map((eng, i) => ({
    match_A: eng,
    match_B: shuffledmatch_B[i],
  }));

  return mixedPairs;
};

onMounted(() => {
  shuffledWords.value = shufflePairs(wordPairs);

});


const getCardStyle = (word: string): string => {
  if (matchedPairs.value.includes(word)) {
    return 'bg-green-600/50 border-green-500 text-white';
  }
  if (error.value && (selectedCardA.value === word || selectedCardB.value === word)) {
    return 'bg-red-600/50 border-red-500 text-white';
  }
  if (selectedCardA.value === word || selectedCardB.value === word) {
    return 'bg-blue-600 border-blue-500 text-white';
  }
  return 'bg-secondary border-ternary text-white hover:bg-ternary';
};

const handleCardClick = (word: string, type: 'a' | 'b') => {
  if (type === 'a') {
    if (wordPairs.some((pair) => pair.match_A === word)) {
      selectedCardA.value = word;
    }
  } else {
    if (wordPairs.some((pair) => pair.match_B === word)) {
      selectedCardB.value = word;
    }
  }

  if (selectedCardA.value && selectedCardB.value) {
    const isPair = wordPairs.some(
      (pair) =>
        pair.match_A === selectedCardA.value && pair.match_B === selectedCardB.value
    );
    if (isPair) {
      matchedPairs.value.push(selectedCardA.value, selectedCardB.value);
      score.value += 1;
      if (matchedPairs.value.length === wordPairs.length * 2) {
        if (score.value < 0) {
          score.value = 0;
        }
        gameCompleted.value = true;
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
          emit('finish', score.value, timerRef.value?.timeLeft);
        }, 5000);
      }
    } else {
      error.value = true;
      score.value -= 1;
    }
    setTimeout(() => {
      error.value = false;
      selectedCardA.value = null;
      selectedCardB.value = null;
    }, 1000);
  }
};
</script>