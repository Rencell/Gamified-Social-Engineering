<template>
    <div>
        <!-- Quiz Images -->
        <div class="flex flex-col gap-4 justify-center items-center mb-15">
            <!-- First Image -->
            <div>
                <Typewriter :text="currentQuestion.Question" @animationEnd="onAnimationEnd = true" :delay="20"
                    class="text-lg font-bold" />
            </div>
            <div v-show="onAnimationEnd" @click="handleImageClick('image1')" :class="[
                'relative w-md bg-background rounded-xl cursor-pointer ',
                selectedImage === 'image1' ? 'border-3 border-b-5 border-green-500' : 'border-2 border-transparent hover:border-gray-400',
                selectedImage === 'image1' && selectedImage === currentQuestion.answer ? 'border-green-500' : 'border-red-500',
                selectedImage === 'image2' ? 'opacity-50' : '',
                onAnimationEnd ? 'animate-in fade-in duration-500' : 'opacity-0'
            ]">
                <img :src="currentQuestion.image1" alt="Option 1" class="w-full rounded-lg animate-in" />
            </div>

            <!-- Second Image -->
            <div v-show="onAnimationEnd" @click="handleImageClick('image2')" :class="[
                'relative w-md bg-background rounded-xl cursor-pointer ',
                selectedImage === 'image2' ? 'border-3 border-b-5' : 'border-2 border-transparent hover:border-gray-400 ',
                selectedImage === 'image2' && selectedImage === currentQuestion.answer ? 'border-green-500' : 'border-red-500',
                selectedImage === 'image1' ? 'opacity-50' : '',
                onAnimationEnd ? 'animate-in fade-in duration-500' : 'opacity-0'
            ]">
                <img :src="currentQuestion.image2" alt="Option 2" class="w-full rounded-lg animate-in" />
            </div>

        </div>

    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { computed, ref } from 'vue';
import type { TwoImage } from './type';
import { Typewriter } from '@/components/ui/typewriter';
// Props for the two images

defineOptions({
    name: 'TwoImage'
});

const props = defineProps<{
    questions: TwoImage[]
}>();

const emit = defineEmits(['finish']);

const testPosition = ref(0)
const onAnimationEnd = ref(false)
const loading = ref(false);
const score = ref(0);

const currentQuestion = computed(() => {
    return props.questions[testPosition.value]
})



const selectedImage = ref<string | null>(null);


const isCorrect = ref(false);
const handleImageClick = (image: string) => {

    setTimeout(() => {

        if (selectedImage.value !== null) {
            return;
        }

        if (image === currentQuestion.value.answer) {
            isCorrect.value = true;
            score.value += 1;
        }

        selectedImage.value = image;
    }, 1000);
};

const resetQuiz = () => {

}
const finishQuiz = () => {

}

</script>
