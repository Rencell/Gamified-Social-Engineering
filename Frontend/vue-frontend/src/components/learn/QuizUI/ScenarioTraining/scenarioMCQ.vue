<template>
    <div  class="flex flex-col md:flex-row items-center gap-10">
        <LearningImage class="h-60" :image="useImageUrl(mcq.image)!" />
        <div>
            <div class="w-sm flex flex-col gap-2">
                <Typewriter :text="mcq.question" @animation-end="animationEnd = true" class="font-bold text-lg" />
                <div class="space-y-3" :class="animationEnd ? 'animate-in fade-in duration-500' : 'opacity-0'">
                    <Card v-for="(option, index) in mcq.options" :key="index" :class="[
                        'hover:bg-background/30 border-2 border-b-4 cursor-pointer',
                        selectedAnswer === option.id && !isAnswered ? 'dark:border-white/80 border-accent' : 'border-ternary/40',
                        (selectedAnswer && isAnswered) && option.id === mcq.answer ? 'border-green-500' : '',
                        (selectedAnswer === option.id && isAnswered) && option.id !== mcq.answer ? 'border-red-500' : '']"
                        @click="handleAnswerSelect(option.id)">
                        <CardContent class="flex gap-3 items-center">
                            <div class="">
                                <p class="w-7 h-7 text-xs bg-ternary rounded-full flex justify-center items-center text-white">{{
                                    option.id }}</p>
                            </div>
                            <p class="font-bold text-sm text-primary/70">{{ option.text }}</p>
                        </CardContent>
                    </Card>
                </div>

                
                <div v-if="!isAnswered" :class="{ 'ms-auto': mcq.position == 'left' }" class="mt-2">
                    <Button :disabled="!selectedAnswer || loading" @click="handleSubmit">Next</Button>
                </div>
                
            </div>
        </div>
    </div>
    <ResultFooter v-if="isAnswered" :is-correct="isCorrect" :explanation="mcq.explanation ?? ''" @toggle-next="emit('toggleNext')" />
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import type { MCQ } from './type';
import LearningImage from '../../content/UI/Learning/Image/LearningImage.vue';
import { Button } from '@/components/ui/button';
import { ref } from 'vue';
import { Typewriter } from '@/components/ui/typewriter';
import { useImageUrl } from '@/composables/useImageUrl';
import { playSoundFx, SoundFx, useSoundFx } from '@/composables/useSoundFx';
import ResultFooter from '../components/ResultFooter.vue'
const emit = defineEmits(['togglePrev', 'toggleNext', 'addScore']);
const animationEnd = ref(false);
const selectedAnswer = ref<string | null>(null);
const isAnswered = ref(false);
const loading = ref(false);
const isCorrect = ref(false);
const handleAnswerSelect = (optionId: string) => {

    if (selectedAnswer.value && isAnswered.value) return;
    selectedAnswer.value = optionId

};

const handleSubmit = () => {
    if (!selectedAnswer.value) return;
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        if (props.mcq.answer === selectedAnswer.value) {
            isCorrect.value = true;
            emit('addScore');
        }
        isAnswered.value = true;
    }, 2000);
}

const props = defineProps<{
    mcq: MCQ
}>();

</script>