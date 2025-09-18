<template>
    <div class="min-h-screen py-10">
        <Timer ref="timerRef" @time-up="finish($event)" />
        <div class="w-2xl rounded-lg relative min-h-[90dvh] bg-secondary border-t-4 border-t-blue-500 flex flex-col">
    
            <div v-if="answered" class="px-4 py-2">
                <div class="mb-2 ">
                    <span class="font-bold" :class="isCorrect ? 'text-green-500' : 'text-red-500'">{{ isCorrect ? 'Correct!'
                        : 'Incorrect' }}</span>
                </div>
                <div class="text-sm border-s-4 ps-4 flex justify-between items-center"
                    :class="isCorrect ? 'border-green-500' : 'border-red-500'">
                    <p>{{ question.feedback }}</p>
                    <Button @click="nextQuestion()"
                        :class="isCorrect ? 'bg-green-500' : 'bg-red-500 hover:bg-red-500/70'">Next</Button>
                </div>
    
            </div>
    
            <!-- Game Area -->
            <div class="flex-1 relative p-6">
                <!-- Top Card - Clickable -->
                <Card
                    class="absolute top-6 left-6 right-6 bg-background hover:bg-ternary hover:border-slate-600 p-6 text-center shadow-lg cursor-pointer transition-all duration-300"
                    :class="[
                        isAnimationFinished ? 'animate-in fade-in duration-500' : 'opacity-0',
                        loading ? 'opacity-50 cursor-wait' : ''
                    ]" @click="handleAnswerClick('top')">
    
                    <!-- add countdown here -->
                    <h3 class="text-xl font-semibold text-white">{{ question.topAnswer }}</h3>
                    <div v-if="isTop" class="absolute inset-0 rounded-xl animate-pulse"
                        :class="[isCorrect ? 'bg-green-400/80 border-green-400/80' : 'bg-red-400/80 border-red-400/80']" />
                </Card>
    
                <!-- Animated Question - Moves to selected answer -->
                <div class="absolute inset-x-6 top-1/2 flex items-center justify-center pointer-events-none">
                    <div class="transition-all duration-1000 ease-out" :style="{
                        transform: questionPosition,
                        opacity: questionOpacity,
                        zIndex: 10,
                    }">
                        <div :class="isAnimationFinished ? 'border border-dashed animate-in fade-in duration-500' : ''"
                            class="bg-background rounded-2xl p-6 border-gray-600 shadow-xl">
                            <ArrowUp v-if="isAnimationFinished" class="h-6 w-6 text-gray-400 mx-auto mb-4" />
                            <p class="text-white text-lg font-medium leading-relaxed px-4 select-none text-center">
    
                                <Typewriter :text="question.question" @animationEnd="onAnimationEnd" :delay="30" />
                            </p>
                            <ArrowDown v-if="isAnimationFinished" class="h-6 w-6 text-gray-400 mx-auto mt-4" />
                        </div>
                    </div>
                </div>
    
                <!-- Bottom Card - Clickable -->
                <Card
                    class="absolute bottom-6 left-6 right-6 bg-background hover:bg-ternary p-6 text-center shadow-lg cursor-pointer transition-all duration-300"
                    :class="[
                        isAnimationFinished ? 'animate-in fade-in duration-500' : 'opacity-0',
                        loading ? 'opacity-50 cursor-wait' : ''
                    ]" @click="handleAnswerClick('bottom')">
                    <h3 class="text-xl font-semibold text-white">{{ question.bottomAnswer }}</h3>
                    <div v-if="isBottom" class="absolute inset-0 rounded-xl animate-pulse"
                        :class="[isCorrect ? 'bg-green-400/80 border-green-400/80' : 'bg-red-400/80 border-red-400/80']" />
                </Card>
    
            </div>
    
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ArrowUp, ArrowDown, Ban, Edit, BookOpen, Shield } from "lucide-vue-next"
import { Typewriter } from '@/components/ui/typewriter'
import type { Question } from './type'
import Timer from '../timer.vue'

defineOptions({
    name: "DragPair"
})

const props = defineProps<{
    questions: Question[];
}>();

const emit = defineEmits(['finish'])
const finish = (time: number) => {
    emit('finish', score.value, time)
}

const isAnimationFinished = ref(false)

const onAnimationEnd = () => {
    isAnimationFinished.value = true
}

const timerRef = ref<InstanceType<typeof Timer> | null>(null);
const loading = ref(false)
const currentQuestionIndex = ref(0)
const selectedAnswer = ref<"top" | "bottom" | null>(null)
const score = ref(0)
const answered = ref(false)
const isAnimating = ref(false)

const question = computed(() => props.questions[currentQuestionIndex.value])
const progress = computed(() => ((currentQuestionIndex.value + 1) / props.questions.length) * 100)

const questionPosition = computed(() => {
    if (!selectedAnswer.value) return "translateY(-50%)"
    if (selectedAnswer.value === "top") return "translateY(-200px)"
    if (selectedAnswer.value === "bottom") return "translateY(20px)"
    return "translateY(-50%)"
})

const questionOpacity = computed(() => {
    return !answered.value ? 1 : 0.8
})

const handleAnswerClick = (answer: "top" | "bottom") => {
    if (answered.value || isAnimating.value) return


    loading.value = true
    setTimeout(() => {
        loading.value = false
        selectedAnswer.value = answer
        isAnimating.value = true
        answered.value = true
    }, 2000)

    if (answer === question.value.correctAnswer) {
        score.value++
    }

}

const nextQuestion = () => {
    if (currentQuestionIndex.value < props.questions.length - 1) {
        isAnimationFinished.value = false
        currentQuestionIndex.value++
        selectedAnswer.value = null
        answered.value = false
        isAnimating.value = false
    } else {
        finish(timerRef.value?.timeLeft || 0);
        isAnimationFinished.value = false
        currentQuestionIndex.value = 0
        score.value = 0
        answered.value = false
        selectedAnswer.value = null
        isAnimating.value = false
    }
}

const isCorrect = computed(() => {
    return selectedAnswer.value === question.value.correctAnswer;
})
const isBottom = computed(() => {
    return selectedAnswer.value === 'bottom';
})
const isTop = computed(() => {
    return selectedAnswer.value === 'top';
})

</script>

