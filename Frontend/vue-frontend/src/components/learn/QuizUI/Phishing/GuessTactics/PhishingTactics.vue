<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Tactic } from './type.ts';
import Typewriter from '@/components/ui/typewriter/Typewriter.vue';
import { Card } from '@/components/ui/card/';
import { Button } from '@/components/ui/button';
import Progress from '@/components/ui/progress/Progress.vue'
import Timer from '../../timer.vue'

defineOptions({
    name: 'PhishingTactics',
});

const props = defineProps<{
    questions: Tactic[];
}>();

const testPosition = ref(0)
const currentQuestion = computed(() => {
    return props.questions[testPosition.value]
})


const isCorrect = computed(() => {
    return selectedAnswer.value === currentQuestion.value.correctAnswer
})

const isAnimationFinished = ref(false)

const onAnimationEnd = () => {
    isAnimationFinished.value = true
}

const selectedAnswer = ref<string | null>(null)
const showResult = ref(false)

const handleAnswerSelect = (answer: string) => {
    if (showResult.value) {
        return
    }
    selectedAnswer.value = answer
}
const score = ref(0)
const isAnswered = ref(false)
const handleSubmit = () => {
    showResult.value = true
    isAnswered.value = true
    if (isCorrect.value) {
        score.value += 1
    }
}

const emit = defineEmits(['finish'])
const loading = ref(false)
const toggleNext = () => {
    loading.value = true
    setTimeout(() => {
        loading.value = false
        testPosition.value++
        if (testPosition.value >= props.questions.length - 1) {
            finishQuiz()
        }
    }, 1000)
}

const finishQuiz = () => {
    emit('finish', score.value)
    resetQuiz()
}

const resetQuiz = () => {

    triggerWhy.value = false
    testPosition.value += 1
    selectedAnswer.value = null
    showResult.value = false
    isAnimationFinished.value = false
    score.value = 0
}

const triggerWhy = ref(false)


</script>


<template>
    <div class="max-w-3xl w-full space-y-8 mx-auto relative" :key="testPosition">
        <Timer @timeUp="finishQuiz" />
        <!-- Icon Section -->
        <div class="flex items-center justify-center space-x-4 mb-6 font-display">
            <div v-if="currentQuestion.type == 'email'" class="bg-[#f6f6f6] p-4 rounded-xl">
                <div class="flex justify-between ">
                    <div class="flex items-center gap-5">
                        <div class="p-2 py-1 rounded-md h-fit bg-black text-blue-400">m</div>
                        <div class="flex gap-2 flex-col font-secondary mb-4 text-background font-medium text-sm">
                            <h1>{{ currentQuestion.sender }}</h1>
                            <h1>{{ currentQuestion.subject }}</h1>
                        </div>
                    </div>

                    <div class="place-content-center text-xs text-background">{{ currentQuestion.date }}</div>
                </div>

                <div class="p-5  bg-white rounded-lg border-1 border-black/40 shadow-xl motion-preset-fade">
                    <div class="py-4 text-black text-sm flex flex-col gap-3">
                        <template v-for="value in currentQuestion.content" :key="value">
                            <a v-if="value.charAt(0) === '#'" href="#"
                                 class="bg-yellow-400 text-black px-4 py-2 w-fit  rounded">
                                {{ value.trim().substring(1) }}
                            </a>

                            <p v-else>{{ value }}</p>
                        </template>

                    </div>

                </div>
            </div>
            <div v-if="currentQuestion.type === 'sms'"
                class="rounded-md overflow-hidden mb-4 max-w-xs mx-auto  motion-preset-fade">
                <div class="bg-gray-800 p-2 text-white text-center text-sm">
                    {{ currentQuestion.sender }}
                </div>
                <div class="bg-gray-200 p-4 min-h-[100px] flex flex-col">
                    <div class="bg-white rounded-lg p-3 shadow-sm self-start max-w-[90%] mb-2">
                        <p class="text-sm">{{ currentQuestion.content }}</p>
                        <p class="text-xs text-gray-500 text-right mt-1">{{ currentQuestion.date }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Options -->
        <div :class="!isAnimationFinished ? 'animate-in fade-in duration-500' : 'opacity-0'">
            <p class="text-slate-400 mb-2 font-bold text-xs">Multiple Choice</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card v-for="(option, index) in currentQuestion.options" :key="index" :class="[
                    'p-4 cursor-pointer transition-all duration-200 border-2',
                    selectedAnswer === option.id
                        ? 'bg-accent/40 border-accent'
                        : 'bg-secondary border-slate-700 hover:bg-slate-700 hover:border-slate-600',
                ]" @click="handleAnswerSelect(option.id)">
                    <div class="flex items-center gap-3">
                        <div :class="[
                            'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                            selectedAnswer === option.id ? 'bg-accent text-white' : 'bg-slate-600 text-slate-300',
                        ]">
                            {{ option.id }}
                        </div>
                        <span class="text-slate-200 font-bold">{{ option.text }}</span>
                    </div>
                </Card>
            </div>
        </div>

        <!-- Submit Button -->
        <div v-if="selectedAnswer && !showResult" class="flex justify-center">
            <Button @click="handleSubmit" class="bg-accent w-full" size="lg">
                Check
            </Button>
        </div>


        <div v-if="isAnswered"
            class="sticky z-50 flex flex-col gap-6 animate-in fade-in bg-background border-t-2 border-ternary w-full bottom-0 p-5 rounded-xl">
            <div>
                <div class="mb-2">
                    <span class="font-bold text-xl" :class="isCorrect ? 'text-green-500' : 'text-red-500'">
                        {{ isCorrect ? 'Correct!' : 'Incorrect' }}
                    </span>
                </div>
                <div class="flex flex-col gap-2 border-s-4 ps-4 text-sm font-semibold"
                    :class="isCorrect ? 'border-green-500' : 'border-red-500'">
                    <div class="font-bold text-lg">
                        Hint
                    </div>
                    <p>adsd</p>
                </div>
            </div>

            <!-- Continue Button -->
            <Button :disabled="loading" v-if="isAnswered" class="mt-4 border-primary/50"
                :class="isCorrect ? 'bg-green-500' : 'bg-red-500'" @click="toggleNext">
                Next
            </Button>
        </div>
    </div>
</template>

<style scoped>
.slideup-enter-active {

    transition: max-height 0.5s ease, opacity 0s ease;
}

.slideup-leave-active {
    transition: max-height 0.2s ease-out, opacity 0s ease;
}

.slideup-enter-from,
.slideup-leave-to {
    max-height: 0;
    opacity: 1;
}

.slideup-enter-to,
.slideup-leave-from {
    max-height: 95dvh;
    opacity: 1;
}




.scroll-hidden::-webkit-scrollbar {
    display: none;
}

.scroll-hidden {
    -ms-overflow-style: none;
    /* IE/Edge */
    scrollbar-width: none;
    /* Firefox */
}
</style>