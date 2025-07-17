<script setup lang="ts">
import { computed, ref } from 'vue'
import { Monitor, Lock, Shield } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import hackMan from '/public/Learning/Content/introToSocialEngineering/CommonAttacks/EnableFirewall@3x.png'
import desktopWarning from '/public/Learning/Content/introToSocialEngineering/CommonAttacks/ExclusiveUsePolicy@3x.png'
import hacks from '/public/Learning/Content/introToSocialEngineering/CommonAttacks/Hacker.png'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import { Typewriter } from '@/components/ui/typewriter'

const isPretest = ref(false)
const isAnimationFinished = ref(false)

const onAnimationEnd = () => {
    isAnimationFinished.value = true
}

const selectedAnswer = ref<string | null>(null)
const showResult = ref(false)

const handleAnswerSelect = (answer: string) => {
    selectedAnswer.value = answer
}

const handleSubmit = () => {
    showResult.value = true
}

const resetQuiz = () => {
    if (testPosition.value >= pretest.length - 1) {
        isPretest.value = false
        return
    }
    testPosition.value += 1
    selectedAnswer.value = null
    showResult.value = false
    isAnimationFinished.value = false
}

const pretest = [
    {
        image: hacks,
        question: 'What attack that involves tricking a user into revealing sensitive information over the phone?',
        options: [
            { id: 'A', text: 'Phishing' },
            { id: 'B', text: 'Vishing' },
            { id: 'C', text: 'Tailgating' },
            { id: 'D', text: 'Baiting' },
        ],
        correctAnswer: 'B',
        explanation: 'Vishing, or voice phishing, involves using phone calls to trick users into revealing sensitive information.',
    },
    {
        image: desktopWarning,
        question: 'What attack involves gaining physical access to a restricted area by following an authorized person?',
        options: [
            { id: 'A', text: 'Vishing' },
            { id: 'B', text: 'Impersonation' },
            { id: 'C', text: 'Tailgating' },
            { id: 'D', text: 'Baiting' },
        ],
        correctAnswer: 'C',
        explanation: 'Tailgating is a physical security breach where an unauthorized person follows an authorized individual into a restricted area.',
    },
]
const testPosition = ref(0)
const currentQuestion = computed(() => {

    return pretest[testPosition.value]
})

const isCorrect = computed(() => {
    return selectedAnswer.value === currentQuestion.value.correctAnswer
})
</script>

<template>
    <div v-if="!isPretest" class="snap-start min-h-screen flex flex-col items-center justify-center">

        <LearningImage :image="hackMan" />

        <LearningSection>
            <LearningHeader>
                Different Types of Attacks
            </LearningHeader>
            <LearningBody>
                Understanding the different types of social engineering attacks is crucial for recognizing and defending
                against them.

            </LearningBody>
            <LearningBody>
                But before we dive into the types of attacks, let's take a Pre-test.
            </LearningBody>
        </LearningSection>

        <Button size="lg" @click="isPretest = true">
            <Monitor></Monitor>Take Pre-test
        </Button>

    </div>

    <div v-else class="snap-start min-h-screen flex flex-col items-center justify-center">
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
                        <span class="font-bold" :class="isCorrect ? 'text-green-500' : 'text-red-500'">{{ isCorrect ? 'Correct!' : 'Incorrect' }}</span>
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
    </div>
</template>
