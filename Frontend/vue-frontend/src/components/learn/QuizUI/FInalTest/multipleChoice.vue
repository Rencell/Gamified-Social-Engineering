<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MultipleChoice } from './type';
import Typewriter from '@/components/ui/typewriter/Typewriter.vue';
import { Card } from '@/components/ui/card/';
import { Button } from '@/components/ui/button';
import LearningImage from '../../content/UI/Learning/Image/LearningImage.vue';


const props = defineProps<{
    Question: MultipleChoice;
}>();

const currentQuestion = computed(() => {
    return props.Question
})
const emit = defineEmits(['isAnswered', 'addScore', 'isCorrect']);

const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value.correctAnswer)

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

const loading = ref(false);
const handleSubmit = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        showResult.value = true;
        emit('isAnswered', true);
        emit('isCorrect', isCorrect.value);
        if (isCorrect.value) {
            emit('addScore');
        }
    }, 1000);

}

const getCardClass = (id: string) => {
    if (selectedAnswer.value === id && showResult.value) {
        return isCorrect.value
            ? 'border-green-500 bg-green-500/30'
            : 'border-red-500 bg-red-500/30'
    }

    if (selectedAnswer.value === id) {
        return 'bg-accent/40 border-accent'
    }

    return 'bg-secondary border-ternary/40 border-2 border-b-4 hover:bg-slate-700 hover:border-slate-600'
}

const getCircleClass = (id: string) => {
    if (selectedAnswer.value === id && showResult.value) {
        return isCorrect.value ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }

    if (selectedAnswer.value === id) {
        return 'bg-accent text-white'
    }

    return 'bg-slate-600 text-slate-300'
}

</script>


<template>
    <div class="max-w-3xl w-full space-y-8">

        <!-- Icon Section -->
        <div class="flex items-center justify-center space-x-4 mb-6 ">
            <LearningImage :image="currentQuestion.image" />
        </div>

        <!-- Question -->
        <div class="w-full h-10">
            <div class="text-2xl font-semibold mb-2 font-sans">
                <Typewriter :text="currentQuestion.question" @animationEnd="onAnimationEnd" :delay="30" />
            </div>
        </div>

        <!-- Options -->
        <div :class="isAnimationFinished ? 'animate-in fade-in duration-500' : 'opacity-0'">
            <p class="text-slate-400 mb-2 font-bold text-sm">Multiple Choice</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card v-for="option in currentQuestion.options" :key="option.id" :class="[
                    'p-4 cursor-pointer transition-all duration-200 border-2',
                    getCardClass(option.id)
                ]" @click="handleAnswerSelect(option.id)">
                    <div class="flex items-center gap-3">
                        <div :class="[
                            'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                            getCircleClass(option.id)
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
            <Button @click="handleSubmit" class="bg-accent w-full" size="lg" :disabled="loading">
                Check
            </Button>
        </div>

        <!-- Result -->
    </div>
</template>

<style scoped>
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