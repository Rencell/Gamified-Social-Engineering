<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Question } from './type';
import Typewriter from '@/components/ui/typewriter/Typewriter.vue';
import { Card } from '@/components/ui/card/';
import { Button } from '@/components/ui/button';
import LearningImage from '../../content/UI/Learning/Image/LearningImage.vue';

const props = defineProps<{
    pretest: Question[];
}>();

const testPosition = ref(0)
const currentQuestion = computed(() => {

    return props.pretest[testPosition.value]
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

const handleSubmit = () => {
    showResult.value = true
}

const resetQuiz = () => {
    if (testPosition.value >= props.pretest.length - 1) {
        return
    }
    testPosition.value += 1
    selectedAnswer.value = null
    showResult.value = false
    isAnimationFinished.value = false
}

</script>


<template>
    <div class="max-w-3xl w-full space-y-8" :key="testPosition">
        <!-- Icon Section -->
        <div class="flex items-center justify-center space-x-4 mb-6 ">
            <LearningImage :image="currentQuestion.image" />
        </div>

        <!-- Question -->
        <div class="text-center w-full h-20">
            <div class="text-3xl font-bold mb-2">
                <Typewriter :text="currentQuestion.question" @animationEnd="onAnimationEnd" />
            </div>
        </div>

        <!-- Options -->
        <div :class="isAnimationFinished ? 'animate-in fade-in duration-500' : 'opacity-0'">
            <p class="text-slate-400 mb-2 font-bold text-xs">Multiple Choice</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card v-for="option in currentQuestion.options" :key="option.id" :class="[
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

        <!-- Result -->
        <div v-if="showResult" class="space-y-4">
            <div>
                <div class="mb-2">
                    <span class="font-bold" :class="isCorrect ? 'text-green-500' : 'text-red-500'">{{ isCorrect ?
                        'Correct!' : 'Incorrect' }}</span>
                </div>
                <div class="text-sm border-s-4 ps-4" :class="isCorrect ? 'border-green-500' : 'border-red-500'">
                    <p>{{ currentQuestion.explanation }}</p>
                </div>
            </div>
            <Button @click="resetQuiz" class="w-full" :class="isCorrect ? 'bg-green-500' : 'bg-red-500'">
                Continue
            </Button>
        </div>
    </div>
</template>