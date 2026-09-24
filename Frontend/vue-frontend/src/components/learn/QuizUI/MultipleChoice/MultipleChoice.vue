<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MultipleChoice } from './type';
import Typewriter from '@/components/ui/typewriter/Typewriter.vue';
import { Card } from '@/components/ui/card/';
import { Button } from '@/components/ui/button';
import LearningImage from '../../content/UI/Learning/Image/LearningImage.vue';
import { useImageUrl } from '@/composables/useImageUrl';
import Timer from '../timer.vue'
import ResultFooter from '../components/ResultFooter.vue';


defineOptions({
    name: 'MultipleChoice'
});

const props = defineProps<{
    questions: MultipleChoice[];
}>();

const testPosition = ref(0)
const currentQuestion = computed(() => {
    return props.questions[testPosition.value]
})


const isCorrect = computed(() => {
    return selectedAnswer.value === currentQuestion.value.correctAnswer
})

const isAnimationFinished = ref(false)

const onAnimationEnd = () => {
    isAnimationFinished.value = true
}

const selectedAnswer = ref<string | null>(null)
const showResult = ref(false)
const score = ref(0)
const handleAnswerSelect = (answer: string) => {
    if (showResult.value) {
        return
    }
    selectedAnswer.value = answer
}
const timerRef = ref<InstanceType<typeof Timer> | null>(null);
const loading = ref(false);
const handleSubmit = () => {
    setTimeout(() => {
        showResult.value = true
        if (isCorrect.value) {
            score.value += 1
        }
    }, 1000);
}

const resetQuiz = () => {
    if (testPosition.value >= props.questions.length) {
        toggleFinish()
        return
    }
    loading.value = true
    setTimeout(() => {
        loading.value = false
        testPosition.value += 1
        selectedAnswer.value = null
        showResult.value = false
        isAnimationFinished.value = false
    }, 1000);
}

const emit = defineEmits(['finish']);

const toggleFinish = () => {
    emit('finish', score.value, timerRef.value?.timeLeft || 0);
}

</script>


<template>
    <div class="max-w-3xl w-full ">
        
        <!-- <Progress :modelValue="percentage" /> -->
        
        <Timer ref="timerRef" @time-up="toggleFinish" />
        <div :key="testPosition" class="space-y-8">
            <!-- Icon Section -->
            <div v-if="currentQuestion.image" class="flex items-center justify-center space-x-4 mb-6 ">
                <LearningImage :image="useImageUrl(currentQuestion.image)!" />
            </div>
    
            <!-- Question -->
            <div class="text-center w-full h-20">
                <div class="text-2xl font-bold mb-2">
                    <Typewriter :text="currentQuestion.question" @animationEnd="onAnimationEnd" :delay="30" />
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
                                'rounded-full flex items-center justify-center font-bold',
                                selectedAnswer === option.id ? 'bg-accent text-white' : 'bg-slate-600 text-slate-300',
                            ]">
                                <p class="size-8 flex justify-center items-center">{{ option.id }}</p>
                            </div>
                            <span class="text-slate-200 font-bold">{{ option.text }}</span>
                        </div>
                    </Card>
                </div>
            </div>
    
            <!-- Submit Button -->
            <div :class="{'hidden' : !(selectedAnswer && !showResult)}" class="flex justify-center">
                <Button @click="handleSubmit" class="bg-accent w-full" size="lg">
                    Check
                </Button>
            </div>
        </div>
    </div>
    <ResultFooter v-if="showResult" @toggle-next="resetQuiz" :explanation="currentQuestion.explanation" :is-correct="isCorrect"/>

    
</template>

<style scoped>
.slideup-enter-active{

    transition: max-height 0.5s ease, opacity 0s ease;
}
.slideup-leave-active {
  transition: max-height 0.2s ease-out, opacity 0s ease;
}

.slideup-enter-from,
.slideup-leave-to {
  max-height: 0;
  opacity: 1;
}

.slideup-enter-to,
.slideup-leave-from {
  max-height: 95dvh;
  opacity: 1;
}




.scroll-hidden::-webkit-scrollbar {
    display: none;
}

.scroll-hidden {
    -ms-overflow-style: none;
    /* IE/Edge */
    scrollbar-width: none;
    /* Firefox */
}
</style>