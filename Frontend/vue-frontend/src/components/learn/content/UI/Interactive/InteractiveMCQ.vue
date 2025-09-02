<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { MCQ, Option } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LearningImage2 from '../Learning/Image/LearningImage2.vue';
const emit = defineEmits(['showDown'])

const props = defineProps<{
    mcq: MCQ
    image?: string | null
}>();

const selectedAnswer = ref<string | null>(null);
const showResult = ref(false);
const isAnswered = ref(false);

const handleAnswerSelect = (optionId: string) => {
    if (showResult.value) return;
    selectedAnswer.value = optionId;

};

const handleSubmit = () => {
    if (selectedAnswer.value) {
        showResult.value = true;
        emit('showDown')
    }


};

const handleContinue = () => {
    isAnswered.value = true;
};

const isCorrect = computed(() => {
    return selectedAnswer.value === props.mcq.correctAnswer;
});



</script>

<template>
    <div class="space-y-5">
        <div v-if="!isAnswered" class="space-y-5 pb-20">
            <LearningImage2 v-if="props.image" :image="props.image" />
            <p class="font-bold text-lg">{{ mcq.question }}</p>
            <div class="space-y-3">
                <Card v-for="option in mcq.options" :key="option.id" @click="handleAnswerSelect(option.id)" :class="[
                    'hover:bg-background/30 border-2 border-b-4 cursor-pointer',
                    selectedAnswer === option.id ? 'border-white/80' : 'border-ternary/40',
                    showResult && option.id === mcq.correctAnswer ? 'border-green-500' : '',
                    showResult && selectedAnswer === option.id && !isCorrect ? 'border-red-500' : ''
                ]">
                    <CardContent class="flex gap-3 items-center ">
                        <div class="">
                            <p class="w-10 h-10 text-xs bg-ternary rounded-full flex justify-center items-center">{{
                                option.id }}</p>
                        </div>
                        <p class="font-bold text-lg text-white/70">{{ option.text }}</p>
                    </CardContent>
                </Card>
            </div>

            <Button size="lg" v-if="selectedAnswer && !showResult" @click="handleSubmit"
                class="w-full border-b-4 border-primary/30">Check</Button>

            <div v-if="showResult">

                <Button v-if="!isCorrect" variant="destructive" size="lg" @click="handleContinue"
                    class="w-full mt-4 border-b-4 border-primary/30">Show
                    Why
                </Button>
                <Button v-else size="lg" @click="handleContinue"
                    class="bg-green-500/50 w-full mt-4 border-b-4 border-primary/30">Show
                    Why
                </Button>
            </div>

        </div>

        <div v-else>
            <slot name="lesson"></slot>
        </div>
    </div>
</template>
