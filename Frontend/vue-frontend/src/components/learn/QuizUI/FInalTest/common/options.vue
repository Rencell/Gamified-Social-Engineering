<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Typewriter } from '@/components/ui/typewriter';
import { computed, ref } from 'vue';

const props = defineProps<{
    question: string;
    options: { id: string; text: string }[];
    answer: string;
    singleGrid?: boolean;
}>();

const emit = defineEmits(['isAnswered', 'isCorrect']);

const selectedAnswer = ref<string | null>(null);
const isAnswered = ref(false);
const showOptions = ref(false);
const isCorrect = computed(() => selectedAnswer.value === props.answer)

const handleAnswerSelect = (optionId: string) => {
    if(!isAnswered.value){

        selectedAnswer.value = optionId;
    } 
};

const submitHandler = () => {
    setTimeout(() => {
    if (isCorrect.value) {
        
            emit('isCorrect');
        } 
        emit('isAnswered');
        
        isAnswered.value = true;
    }, 500);
};


const getCardClass = (id: string) => {
    if (selectedAnswer.value === id && isAnswered.value) {
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
    if (selectedAnswer.value === id && isAnswered.value) {
        return isCorrect.value ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }

    if (selectedAnswer.value === id) {
        return 'bg-accent text-white'
    }

    return 'bg-slate-600 text-slate-300'
}

const getButtonClass = () => {
    if(isAnswered.value)
        return isCorrect.value ? 'bg-green-500 hover:bg-green-500/70' : 'bg-red-500 hover:bg-red-500/70'
}
</script>

<template>
    <div :class="{'w-sm' : singleGrid}" class="mx-auto space-y-5">
        <Typewriter :class="{'w-sm' : singleGrid}" class="font-display text-xl font-semibold" :text="question" :delay="30" @animation-end="showOptions = true" />
        <div v-if="showOptions" class="motion-preset-fade motion-duration-700">
            <p class="text-slate-400 mb-2 font-bold text-xs">Choices</p>
            <div class="grid grid-cols-1 gap-4" :class="singleGrid ? 'md:grid-cols-1' : ' md:grid-cols-2'">
                <Card v-for="option in options" :key="option.id" :class="[
                    'p-4 cursor-pointer transition-all duration-200 border-2',
                    getCardClass(option.id),
                ]" @click="handleAnswerSelect(option.id)">
                    <div class="flex items-center gap-3">
                        <div>
                            <div :class="[
                                'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                                getCircleClass(option.id),
                            ]">
                                {{ option.id }}
                            </div>
                        </div>
                        <span class="text-slate-200 font-bold">{{ option.text }}</span>
                    </div>
                </Card>
            </div>
            <!-- Submit Button -->
            <div v-if="selectedAnswer" class="flex justify-center pt-4">
                <Button @click="submitHandler" :class="['bg-accent w-full', getButtonClass()]" size="lg">
                    Check
                </Button>
            </div>
        </div>
    </div>

</template>