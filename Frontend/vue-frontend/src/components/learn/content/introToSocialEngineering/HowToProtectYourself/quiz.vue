<template>
    <div class="snap-center min-h-screen flex flex-col items-center justify-center p-6 space-y-6">

        <div class="w-full max-w-3xl space-y-6">
            <!-- Question Card -->
            <Card :class="['border-t-4 border-t-blue-500', { 'vibrate': isWrong }]">
                <CardContent class="p-8">
                    <div v-if="!quizCompleted" class="text-center space-y-8">
                        <h2 class="text-xl font-semibold text-gray-300 space-y-8">
                            <Typewriter :text="currentQuestion.text"></Typewriter>
                            <div class="flex justify-center">
                                <div class="w-16 h-0.5 bg-gray-300"></div>
                            </div>
                        </h2>
                        <div class="grid grid-cols-2 gap-6">
                            <!-- Do -->
                            <Card class="cursor-pointer transition-all duration-200  hover:shadow-md border-2 border-dashed "
                                :class="currentQuestion.answer == 0 && answers[currentQuestionIndex] === 0 ? 'bg-green-400/40 animate-pulse' : 'hover:bg-slate-800 border-gray-300 hover:border-gray-400'"
                                @click="handleAnswer(currentQuestionIndex, 0)">
                                <CardContent class="relative flex items-center justify-center h-32">
                                    <Transition name="fade">
                                        <div v-if="answers[currentQuestionIndex] !== undefined && answers[currentQuestionIndex] === 0"
                                            class="absolute top-0 left-5">
                                            <CircleCheck v-if="currentQuestion.answer === 0" class="text-green-500" />
                                            <CircleX v-else class="text-red-500" />
                                        </div>
                                    </Transition>

                                    <span class="text-lg font-medium text-gray-300">Do</span>
                                </CardContent>
                            </Card>
                            <!-- Dont -->
                            <Card class="cursor-pointer transition-all duration-200 hover:shadow-md border-2 border-dashed"
                                :class="currentQuestion.answer == 1 && answers[currentQuestionIndex] === 1 ? 'hover:bg-green-400/50 bg-green-400/40 animate-pulse' : 'hover:bg-slate-800 border-gray-300 hover:border-gray-400'"
                                @click="handleAnswer(currentQuestionIndex, 1)">
                                <CardContent class="relative flex items-center justify-center h-32">
                                    <Transition name="fade">
                                        <div v-if="answers[currentQuestionIndex] !== undefined && answers[currentQuestionIndex] === 1"
                                            class="absolute top-0 left-5">
                                            <CircleCheck v-if="currentQuestion.answer === 1" class="text-green-500" />
                                            <CircleX v-else class="text-red-500" />
                                        </div>
                                    </Transition>
                                    <span class="text-lg font-medium text-gray-300">Don't</span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div v-else class="font-bold text-xl gap-7 flex flex-col text-center">
                        <div>{{ score }} / {{ questions.length }} Question Correct</div>
                        <div class="flex justify-center">
                            <div class="w-16 h-0.5 bg-gray-300"></div>
                        </div>
                        <div class="flex flex-col gap-2 justify-center items-center text-xs hover:text-slate-400 cursor-pointer" @click="resetQuiz">
                            <p>REPLAY</p>
                            <RotateCcw />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <!-- Navigation -->
            <div class="flex justify-center items-center">

                <div class="flex gap-2">
                    <button v-for="(_, index) in questions" :key="index" @click="() => setCurrentQuestion(index)"
                        :class="[
                            'w-3 h-3 rounded-full transition-colors',
                            index === currentQuestionIndex ? 'bg-blue-500' : answers[index] ? 'bg-green-500' : 'bg-gray-300',
                        ]" />
                </div>

                <!-- <Button v-if="currentQuestionIndex === questions.length - 1" @click="resetQuiz">Reset Quiz</Button> -->

            </div>
            <!-- Results Summary -->
            <!-- <Card v-if="completedQuestions === questions.length" class="border-green-200 bg-green-50">
                <CardContent class="p-6">
                    <h3 class="text-lg font-semibold text-green-800 mb-4">Quiz Complete!</h3>
                    <div class="space-y-2 text-sm">
                        <div v-for="(question, index) in questions" :key="index" class="flex justify-between">
                            <span class="text-gray-700">{{ question }}</span>
                            <span :class="['font-medium', answers[index] === 'do' ? 'text-green-600' : 'text-red-600']">
                                {{ answers[index] === 'do' ? "Do" : "Don't" }}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Typewriter } from '@/components/ui/typewriter';
import { CircleCheck, CircleX, RotateCcw } from 'lucide-vue-next';
const questions = [
    {
        text: 'use the same password for several accounts',
        answer: 0
    },
    {
        text: 'share your personal information on social media',
        answer: 0
    },
    {
        text: 'click on suspicious email links',
        answer: 0
    },
    {
        text: 'use public Wi-Fi for banking',
        answer: 0
    },
    {
        text: 'use two-factor authentication',
        answer: 1
    },
    {
        text: 'save passwords in your browser',
        answer: 0
    },
    {
        text: 'download software from unknown sources',
        answer: 0
    },
    {
        text: 'ignore software updates',
        answer: 0
    },
    {
        text: 'backup your important data regularly',
        answer: 1
    },
    {
        text: 'check privacy settings on apps',
        answer: 1
    },
];

const currentQuestionIndex = ref(0);
const currentQuestion = computed(() => questions[currentQuestionIndex.value]);
const isWrong = ref(false);

const score = ref(0)

const tryCount = ref(0)
const answers = ref<Record<number, 0 | 1>>({});

const allowClick = ref(true);

const handleAnswer = (questionIndex: number, answer: 0 | 1) => {
    if (!allowClick.value) return;

    allowClick.value = false;
    answers.value[questionIndex] = answer;

    const isAnswerWrong = currentQuestion.value.answer !== answer;

    if (isAnswerWrong) {
        isWrong.value = true;
        setTimeout(() => {
            isWrong.value = false;
            delete answers.value[questionIndex];
            tryCount.value = 1;
            allowClick.value = true;
        }, 1000);
    } else {
        setTimeout(() => {
            nextQuestion();
            allowClick.value = true;
        }, 1500);
    }
};

const nextQuestion = () => {
    if(tryCount.value == 0){
        score.value += 1
    }
    tryCount.value = 0
    if (currentQuestionIndex.value < questions.length) {
        currentQuestionIndex.value++;
    }
};

const quizCompleted = computed(() => currentQuestionIndex.value >= questions.length);

const resetQuiz = () => {
    answers.value = {};
    currentQuestionIndex.value = 0;
    score.value = 0;
};

const setCurrentQuestion = (index: number) => {
    currentQuestionIndex.value = index;
}

const completedQuestions = computed(() => Object.values(answers.value).length);
const progress = computed(() => (completedQuestions.value / questions.length) * 100);
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.vibrate {
    animation: vibrate 0.5s linear infinite;
}

@keyframes vibrate {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(5px);
    }

    50% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }

    100% {
        transform: translateX(0);
    }
}
</style>