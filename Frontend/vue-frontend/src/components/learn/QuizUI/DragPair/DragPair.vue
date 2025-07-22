<script setup lang="ts">
import { ref, computed } from "vue"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ArrowUp, ArrowDown, Ban, Edit, BookOpen, Shield } from "lucide-vue-next"
import { Typewriter } from '@/components/ui/typewriter'
import Progress from "@/components/ui/progress/Progress.vue"
import type { Question } from './type'

const props = defineProps<{
  questions: Question[];
}>();

const emit = defineEmits(["update:score"]);

const isAnimationFinished = ref(false)

const onAnimationEnd = () => {
    isAnimationFinished.value = true
}



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

    selectedAnswer.value = answer
    isAnimating.value = true
    answered.value = true

    if (answer === question.value.correctAnswer) {
        score.value++
        emit("update:score", score.value);
    }

    setTimeout(() => {
        nextQuestion()
    }, 4000)
}

const nextQuestion = () => {
    if (currentQuestionIndex.value < props.questions.length - 1) {
        isAnimationFinished.value = false
        currentQuestionIndex.value++
        selectedAnswer.value = null
        answered.value = false
        isAnimating.value = false
    } else {
        alert(`Game finished! Your score: ${score.value}/${props.questions.length}`)
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

<template>
    <div class="rounded-lg relative min-h-screen bg-gradient-to-b from-secondary to-black flex flex-col w-full">


        <!-- Header -->
        <div class="flex items-center justify-between p-4">
          
            <div class="flex-1 mx-4">
                <div class="bg-gray-700 rounded-full h-2">
                    <Progress :model-value=33 />
                </div>
            </div>
            <div class="w-6 h-6 bg-gray-700 rounded-sm flex items-center justify-center">
                <ArrowUp class="h-4 w-4 text-gray-300" />
            </div>
        </div>

        <!-- Feedback Message -->
        

        <div v-if="answered" class="px-4 py-2">
            <div class="mb-2 ">
                <span class="font-bold" :class="isCorrect ? 'text-green-500' : 'text-red-500'">{{ isCorrect ? 'Correct!'
                    : 'Incorrect' }}</span>
            </div>
            <div class="text-sm border-s-4 ps-4" :class="isCorrect ? 'border-green-500' : 'border-red-500'">
                <p>{{ question.feedback }}</p>
            </div>
        </div>



        <!-- Game Area -->
        <div class="flex-1 relative p-6">
            <!-- Top Card - Clickable -->
            <Card
                class="absolute top-6 left-6 right-6 bg-secondary border-slate-700 hover:bg-slate-700 hover:border-slate-600 rounded-3xl p-6 text-center shadow-lg cursor-pointer transition-all duration-300"
                :class="[
                    isAnimationFinished ? 'animate-in fade-in duration-500' : 'opacity-0',
                    
                ]" @click="handleAnswerClick('top')">

                <!-- add countdown here -->
                <h3 class="text-xl font-semibold text-white">{{ question.topAnswer }}</h3>
                <div v-if="isTop"
                    class="absolute inset-0 rounded-3xl animate-pulse"
                    :class="[isCorrect ? 'bg-green-400 border-green-400' : 'bg-red-400 border-red-400']"
                />
            </Card>

            <!-- Animated Question - Moves to selected answer -->
            <div class="absolute inset-x-6 top-1/2 flex items-center justify-center pointer-events-none">
                <div class="transition-all duration-1000 ease-out" :style="{
                    transform: questionPosition,
                    opacity: questionOpacity,
                    zIndex: 10,
                }">
                    <div :class="isAnimationFinished ? 'border border-dashed animate-in fade-in duration-500' : ''"
                        class=" rounded-2xl p-6 border-gray-600 shadow-xl">
                        <ArrowUp v-if="isAnimationFinished" class="h-6 w-6 text-gray-400 mx-auto mb-4" />
                        <p class="text-white text-lg font-medium leading-relaxed px-4 select-none text-center">

                            <Typewriter :text="question.question" @animationEnd="onAnimationEnd" />
                        </p>
                        <ArrowDown v-if="isAnimationFinished" class="h-6 w-6 text-gray-400 mx-auto mt-4" />
                    </div>
                </div>
            </div>

            <!-- Bottom Card - Clickable -->
            <Card
                class="absolute bottom-6 left-6 right-6 bg-secondary border-slate-700 hover:bg-slate-700 hover:border-slate-600 rounded-3xl p-6 text-center shadow-lg cursor-pointer transition-all duration-300"
                :class="[
                    isAnimationFinished ? 'animate-in fade-in duration-500' : 'opacity-0',
                ]" @click="handleAnswerClick('bottom')">
                <h3 class="text-xl font-semibold text-white">{{ question.bottomAnswer }}</h3>
                <div v-if="isBottom"
                    class="absolute inset-0 rounded-3xl animate-pulse"
                    :class="[isCorrect ? 'bg-green-400 border-green-400' : 'bg-red-400 border-red-400']"
                />
            </Card>

        </div>

        <!-- Score Display -->
        <div
            class="absolute top-20 right-4 bg-gray-800/80 border border-gray-600 rounded-lg px-3 py-1 text-gray-300 text-sm">
            Score: {{ score }}/{{ props.questions.length }}
        </div>


    </div>
</template>
