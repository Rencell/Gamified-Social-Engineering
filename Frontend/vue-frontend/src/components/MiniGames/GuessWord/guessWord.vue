<template>
    <div class="mx-auto rounded-lg shadow-xl bg-secondary p-6 h-fit">

        <div class="flex flex-col gap-6 w-xl mx-auto ">
            <!-- stage text -->
            <div class="p-4 bg-background rounded-lg text-center text-white font-bold">
                Stage 1/5
            </div>
            <!-- test -->
            <div class="">
                <div class="grow flex gap-4 justify-between">
                    <div class="flex flex-col gap-1">
                        <transition-group name="fade" tag="div" class="flex gap-1">
                            <div class="font-semibold rounded-md h-fit" v-for="n in level_lives" :key="n">
                                <i class="bi bi-heart-fill text-red-500 text-3xl"></i>
                            </div>
                        </transition-group>
                    </div>

                    <div class="flex gap-4 w-80">

                        <div class=" grow bg-background/70 rounded-lg flex text-white border-b-4 border-ternary">
                            <div
                                class="flex-1 bg-background p-2 flex items-center flex-col text-xs font-semibold rounded-s-lg">
                                <p>TIMER</p>
                                <p><i class="bi bi-alarm text-xl"></i></p>
                            </div>
                            <div class="flex-3 flex justify-end items-center text-4xl p-2 py-2 font-bold">
                                1:41
                            </div>
                        </div>
                        <div class="grow bg-background/70 rounded-lg flex text-white border-b-4 border-ternary">
                            <div
                                class="flex-1 bg-background p-2 flex items-center flex-col text-xs font-semibold rounded-s-lg">
                                <p>POINTS</p>
                                <p><i class="bi bi-star text-xl"></i></p>
                            </div>
                            <div class="flex-3 flex justify-end items-center text-4xl p-2 py-2 font-bold">
                                0
                            </div>
                        </div>
                    </div>

                </div>

                <div class="grow flex flex-col gap-6 mt-10">
                    <!-- clue  -->
                    <div class=" flex justify-center items-center p-4 motion-preset-expand" :key="currentLevel.answer">
                        <div class="text-xl font-background flex justify-center items-center bg-ternary text-white transform -rotate-3 rounded-md border-secondary  border-4 p-4 shadow-xl w-72"
                            style="box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;">
                            {{ currentLevel.clues }}
                        </div>

                    </div>

                    <!-- Letter chose -->
                    <div class="flex justify-center gap-2">
                        <div @click="clearAnswer()"
                            class="cursor-pointer w-10 h-10 border-2  rounded-md flex items-center justify-center text-lg font-bold bg-secondary text-white">
                            <Eraser></Eraser>
                        </div>
                        <div v-for="(letter, index) in userAnswer" :key="'answer-' + index"
                            :class="checkAnswer == 2 ? 'border-red-500 motion-preset-shake ' : 'border-primary'"
                            class="cursor-pointer w-10 h-10 border-2  rounded-md flex items-center justify-center text-lg font-bold"
                            @click="removeLetter(letter, index)">
                            {{ letter || '' }}
                        </div>
                    </div>


                    <!-- Letter Selection -->
                    <div class="grid grid-cols-8 gap-2 px-10">
                        <button v-for="(letter, index) in availableLetters" :key="'letter-' + index"
                            class="cursor-pointer w-10 h-10 p-0 text-lg font-semibold border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 bg-ternary"
                            :disabled="selectedLetterIndices.includes(index)" @click="selectLetter(letter, index)">
                            {{ letter }}
                        </button>
                    </div>

                    <div v-if="user_fail !== null">
                        <div class="p-2 ps-4 rounded-lg outline-1 text-sm flex justify-between">
                            <div v-if="user_fail === 'fail'">
                                <div class="text-red-500 font-semibold"><i class="bi bi-check-circle"></i> You lose, the correct is</div>
                                <i>"{{ currentLevel.completeProverb }}"</i>"
                            </div>
                            <div v-else>
                                <div class="text-green-500 font-semibold"><i class="bi bi-check-circle"></i> You are correct, impressive</div>
                                
                            </div>
                            
                            <Button :click="increaseCurrentLevel">Next</Button>
                        </div>

                    </div>
                </div>
            </div>

        </div>


    </div>

    
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Eraser } from 'lucide-vue-next';
import { computed, onMounted, ref, watch } from 'vue';

// Define the structure of the data
interface Level {
  clues: string;
  answer: string;
  completeProverb: string;
}

// Define the data array
const data: Level[] = [
  {
    clues: "Think before you ___ on suspicious links.",
    answer: "click",
    completeProverb: "Think before you click on suspicious links.",
  },
  {
    clues: "Verify the ___ before sharing sensitive information.",
    answer: "source",
    completeProverb: "Verify the source before sharing sensitive information.",
  },
  {
    clues: "Don't share your ___ with anyone.",
    answer: "password",
    completeProverb: "Don't share your password with anyone.",
  },
  {
    clues: "Beware of ___ emails asking for personal details.",
    answer: "phishing",
    completeProverb: "Beware of phishing emails asking for personal details.",
  },
  {
    clues: "Always enable ___ authentication for added security.",
    answer: "two-factor",
    completeProverb: "Always enable two-factor authentication for added security.",
  },
];

// State variables
const current_level_index = ref<number>(0);
const userAnswer = ref<string[]>([]);
const selectedLetterIndices = ref<number[]>([]);
const availableLetters = ref<string[]>([]);
const level_lives = ref<number>(0);
const user_fail = ref<'fail' | 'success' | null>(null);

// Computed property for the current level
const currentLevel = computed<Level>(() => data[current_level_index.value]);

// Function to set up the level
const setupLevel = (): void => {
  const level = currentLevel.value;
  userAnswer.value = Array(level.answer.length).fill('');
  selectedLetterIndices.value = [];
  level_lives.value = 3;
  user_fail.value = null;

  // Create available letters (answer + random letters)
  const answerLetters = level.answer.toUpperCase().split('');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters: string[] = [];

  // Add random letters to make total of 16 letters
  while (randomLetters.length < 16 - answerLetters.length) {
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!answerLetters.includes(randomLetter) && !randomLetters.includes(randomLetter)) {
      randomLetters.push(randomLetter);
    }
  }

  availableLetters.value = [...answerLetters, ...randomLetters].sort(() => Math.random() - 0.5);
};

// Function to increase the current level
const increaseCurrentLevel = (): void => {
  current_level_index.value++;

  if (current_level_index.value > data.length - 1) {
    // 
  } else {
    setupLevel();
  }
};

// Function to handle letter selection
const selectLetter = (letter: string, index: number): void => {
  if (user_fail.value !== null) return;

  const emptyIndex = userAnswer.value.findIndex((l) => l === '');
  const emptyIndex2 = selectedLetterIndices.value.findIndex((l) => l === -1);

  if (emptyIndex !== -1) {
    if (emptyIndex2 !== -1) {
      userAnswer.value[emptyIndex] = letter;
      selectedLetterIndices.value[emptyIndex2] = index;
      return;
    }
    userAnswer.value[emptyIndex] = letter;
    selectedLetterIndices.value.push(index);
  }
};

// Function to clear the user's answer
const clearAnswer = (): void => {
  userAnswer.value = Array(currentLevel.value.answer.length).fill('');
  selectedLetterIndices.value = [];
};

// Function to remove a letter
const removeLetter = (letter: string, index: number): void => {
  if (user_fail.value !== null) return;
  userAnswer.value[index] = '';
  if (selectedLetterIndices.value[index + 1] == null) {
    selectedLetterIndices.value.splice(index, 1);
  } else {
    selectedLetterIndices.value[index] = -1;
  }
};

// Computed property to check the answer
const checkAnswer = computed<number>(() => {
  const isAnswerLengthMatch = selectedLetterIndices.value.length === currentLevel.value.answer.length;

  if (isAnswerLengthMatch) {
    const hasEmptyLetter = selectedLetterIndices.value.includes(-1);
    if (hasEmptyLetter) {
      return 3;
    }
    if (userAnswer.value.join('') === currentLevel.value.answer.toUpperCase()) {
      return 1;
    } else {
      return 2;
    }
  }

  return 0;
});

// Watcher for the checkAnswer computed property
watch(checkAnswer, (newVal) => {
  if (newVal === 2) {
    level_lives.value--;
    if (level_lives.value <= 0) {
      user_fail.value = 'fail';
    }
  } else if (newVal === 1) {
    user_fail.value = 'success';
  }
});


// Lifecycle hook
onMounted(() => {
  setupLevel();
});
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(0.5rem);
}
</style>