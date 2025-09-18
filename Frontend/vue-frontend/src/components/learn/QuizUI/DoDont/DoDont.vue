<template>
    <div class="snap-center min-h-screen flex flex-col items-center justify-center p-6 space-y-6">
        <div class="w-2xl max-w-3xl space-y-6">
            <Timer @time-up="finish" ref="timerRef" />
            <!-- Question Card -->
            <Card :class="['border-t-4 border-t-blue-500', { 'vibrate': isWrong }]">
                <CardContent class="p-8">
                    <div class="text-center space-y-8">
                        <h2 class="text-xl font-semibold text-gray-300 space-y-8">
                            <Typewriter :text="currentQuestion.text"></Typewriter>
                            <div class="flex justify-center">
                                <div class="w-16 h-0.5 bg-gray-300"></div>
                            </div>
                        </h2>
                        <div class="grid grid-cols-2 gap-6">
                            <!-- Do -->
                            <Card
                                class="cursor-pointer transition-all duration-200  hover:shadow-md border-2 border-dashed "
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
                            <Card
                                class="cursor-pointer transition-all duration-200 hover:shadow-md border-2 border-dashed"
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

            </div>
        </div>

    </div>

</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Card, CardContent } from '@/components/ui/card';
import { Typewriter } from '@/components/ui/typewriter';
import { CircleCheck, CircleX, RotateCcw } from 'lucide-vue-next';
import type { Question } from './type';
import quizSummary from '../quizSummary.vue'
import { useLearningStore } from '@/stores/learning';
import Timer from '../timer.vue'
const learningStore = useLearningStore();
const timerRef = ref<InstanceType<typeof Timer> | null>(null);

defineOptions({
    name: "DoDont"
})
const props = defineProps<{
    questions: Question[];
}>();

const nextLesson = () => {
    learningStore.nextModule();
    resetQuiz();
};

const emit = defineEmits(['finish'])
const finish = () => {
    emit('finish', score.value, timerRef.value?.timeLeft) // score, answers
}

const currentQuestionIndex = ref(0);
const currentQuestion = computed(() => props.questions[currentQuestionIndex.value]);
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
    if (tryCount.value == 0) {
        score.value += 1
    }
    tryCount.value = 0
    if (currentQuestionIndex.value < props.questions.length) {
        currentQuestionIndex.value++;
    }


    if (currentQuestionIndex.value >= props.questions.length) {
        finish();
    } else {
        setCurrentQuestion(currentQuestionIndex.value);
    }
};

const quizCompleted = computed(() => currentQuestionIndex.value >= props.questions.length);

const resetQuiz = () => {
    answers.value = {};
    currentQuestionIndex.value = 0;
    score.value = 0;
};

const setCurrentQuestion = (index: number) => {
    currentQuestionIndex.value = index;
}

const completedQuestions = computed(() => Object.values(answers.value).length);
const progress = computed(() => (completedQuestions.value / props.questions.length) * 100);
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