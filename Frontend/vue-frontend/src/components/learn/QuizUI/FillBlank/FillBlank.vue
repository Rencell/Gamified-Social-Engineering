<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button';
import { computed, ref } from 'vue';
import LearningSection from '../../content/UI/Learning/Core/LearningSection.vue';
import LearningHeader from '../../content/UI/Learning/Core/LearningHeader.vue';
import LearningSpan from '../../content/UI/Learning/Highlight/LearningSpan.vue';
import LearningBody from '../../content/UI/Learning/Core/LearningBody.vue';
import type { Question } from './type';
import { Input } from '@/components/ui/input';
import { CircleCheck, CircleX } from 'lucide-vue-next';


const props = defineProps<{
    questions: Question[];
}>();

const emit = defineEmits(['quizSummary', 'finish']);

const finish = () => {
    emit('finish', score.value)
}

const score = ref(0);
const answers = ref<string[]>([]);
const selectedAnswers = ref<string>('');
const review = ref(false);
const quizFinished = ref(false);

const currentQuestionIndex = ref(0);
const currentQuestion = computed(() => props.questions[currentQuestionIndex.value]);

const nextQuestion = () => {



    if (selectedAnswers.value === currentQuestion.value.answer) {
        score.value += 1;
    }
    answers.value[currentQuestionIndex.value] = selectedAnswers.value;
    review.value = true;

    startCountdown();

};

const total = 2000
const countdown = ref(total); // 5 seconds = 5000 ms

const startCountdown = () => {
    countdown.value = total; // reset
    const interval = setInterval(() => {
        countdown.value -= 100; // decrease by 100 ms
        if (countdown.value <= 0) {
            clearInterval(interval);
        }
    }, 100); // run every 100 ms

    setTimeout(() => {
        review.value = false;
        selectedAnswers.value = '';
        currentQuestionIndex.value++;
        if (currentQuestionIndex.value >= props.questions.length) {
            quizFinished.value = true;
        }
    }, total);
};

const submitQuiz = () => {
    answers.value[currentQuestionIndex.value] = selectedAnswers.value;
    review.value = true;
    answers.value.map((answer) => {
        if (answer === currentQuestion.value.answer) {
            score.value += 1;
        }
    });
    currentQuestionIndex.value = 0;
    selectedAnswers.value = answers.value[currentQuestionIndex.value];
    finish();
};





const isCorrect = computed(() => {
    return selectedAnswers.value === currentQuestion.value.answer;
});

const percentage = computed(() => {
    return (countdown.value / total) * 100;
});

</script>



<template>
    <Card :class="['border-t-4 border-t-accent']">
        <CardContent>
            <LearningSection>
                <LearningHeader>
                    <LearningSpan>Question Progress</LearningSpan>

                </LearningHeader>
                <LearningBody>
                    This section shows your progress through the questions in the quiz.
                </LearningBody>

            </LearningSection>
        </CardContent>
    </Card>

    <Card class="mt-5" v-if="!quizFinished">
        <CardContent>
            <LearningSection>
                <LearningHeader>

                    <p class="text-sm text-gray-300">{{ currentQuestion.text }}</p>
                </LearningHeader>
                <LearningBody>
                    <Input :class="{
                        'ring-red-400 ring-2': review && !isCorrect,
                        'ring-green-400 ring-2': review && isCorrect
                    }" v-model="selectedAnswers" type="text" :placeholder="currentQuestion.text" />



                    <p v-if="review">
                        {{ isCorrect ? 'Correct!' : 'Incorrect!' }} - The answer is: {{ currentQuestion.answer
                        }}
                    </p>
                    <div class="flex gap-4 justify-between mt-4">

                        <Button @click="nextQuestion()" :disabled="review">
                            Submit
                        </Button>
                    </div>

                </LearningBody>
            </LearningSection>
            <Progress v-if="review" :model-value="percentage" />
        </CardContent>
    </Card>

    <Card class="mt-5 w-2xl" v-else>
        <CardContent class="space-y-3 animate-parent">
            <Card v-for="(value, index) in answers" :key="index" class="border-2 border-green-500/40 bg-green-500/10"
                :class="{
                    'border-red-500/40 bg-red-500/10': value !== props.questions[index].answer
                }">
                <CardContent class="flex flex-col gap-2 text-sm">
                    <div>{{ props.questions[index].text }}</div>
                    <div class="flex gap-2 items-center">
                        <CircleCheck class="text-green-400/50 h-5 w-5" />
                        {{ props.questions[index].answer }}
                    </div>
                    <div v-if="value !== props.questions[index].answer" class="flex gap-2 items-center">
                        <CircleX class="text-red-400/50 h-5 w-5" />
                        {{ value }}
                    </div>
                </CardContent>
            </Card>
            <Button class="w-full" @click="finish()"> Continue</Button>
        </CardContent>

    </Card>

    <div class="flex justify-center items-center mt-3">

        <div class="flex gap-2">
            <div v-for="(_, index) in props.questions" :key="index" :class="[
                'w-3 h-3 rounded-full transition-colors',

                currentQuestionIndex === index ? 'bg-accent' : 'bg-gray-300',
            ]" />
        </div>

    </div>



</template>


<style scoped>

@keyframes drop-in {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-parent > * {
  opacity: 0;
  animation: drop-in 0.5s ease-out forwards;
}

/* Optional: staggered effect */
.animate-parent > *:nth-child(1) {
  animation-delay: 0.3s;
}
.animate-parent > *:nth-child(2) {
  animation-delay: 0.5s;
}
.animate-parent > *:nth-child(3) {
  animation-delay: 0.7s;
}

</style>