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


const props = defineProps<{
    questions:  Question[];
}>();

const answers = ref<Record<number, 0 | 1>>({});
const selectedAnswers = ref<number | null>(null);

const currentQuestionIndex = ref(0);
const currentQuestion = computed(() => props.questions[currentQuestionIndex.value]);

const nextQuestion = () => {
    if (selectedAnswers.value !== null) {
        answers.value[currentQuestionIndex.value] = selectedAnswers.value as 0 | 1;
    }

    if (currentQuestionIndex.value < props.questions.length - 1) {
        currentQuestionIndex.value++;
        selectedAnswers.value = answers.value[currentQuestionIndex.value] ?? null;
    }
};

const prevQuestion = () => {
    if (selectedAnswers.value !== null) {
        answers.value[currentQuestionIndex.value] = selectedAnswers.value as 0 | 1;
    }
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--;
        selectedAnswers.value = answers.value[currentQuestionIndex.value] ?? null;
    }
};

const percentage = computed(() => {
    return ((currentQuestionIndex.value + 1) / props.questions.length) * 100;
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

                <Progress :model-value="percentage" />
            </LearningSection>
        </CardContent>
    </Card>
    
    <Card class="mt-5">
        <CardContent>
            <LearningSection>
                <LearningHeader>
                    
                    <p class="text-sm text-gray-300">{{currentQuestion.text}}</p>
                </LearningHeader>
                <LearningBody>
                    {{ answers[currentQuestionIndex]}}
                    <input v-model="selectedAnswers" type="text" :placeholder="currentQuestion.text" 
                        class="mb-4 text-sm w-full px-4 py-2 rounded bg-[#2A2A3B] text-white focus:outline-none focus:ring-2 focus:ring-accent" />
                    <div class="flex justify-between">
                        <Button @click="prevQuestion()" variant="outline">Previous</Button>
                        <template v-if="currentQuestionIndex < props.questions.length - 1">
                            <Button @click="nextQuestion()">Next</Button>

                        </template>
                        <template v-else>

                            <Button>Submit</Button>
                        </template>
                    </div>
                </LearningBody>
            </LearningSection>
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