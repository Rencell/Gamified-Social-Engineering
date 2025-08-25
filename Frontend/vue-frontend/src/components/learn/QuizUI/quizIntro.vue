<template>
    <div class="min-h-screen flex justify-center items-center ">
        <div class="w-lg flex justify-center items-center flex-col gap-4 animate-parent">
            <div class="size-60 relative flex justify-center items-center">

              <img class="absolute opacity-30 animate-spin [animation-duration:15s]" :src="radial"/>
              <LearningImage class="relative" :image="QuizIntro.image" />
            </div>
            <p class="font-bold text-2xl">{{QuizIntro.title}}</p>
            <p class="font-bold text-lg/relaxed text-primary/30 text-center mb-20">{{QuizIntro.description}} </p>
            <Button @click="emit('startQuiz')" size="lg" class="w-full border-b-4 border-primary/40 font-bold text-lg">Play</Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import LearningImage from '../content/UI/Learning/Image/LearningImage.vue';
import radial from "/radial.png";
const emit = defineEmits(['startQuiz']);

const props = defineProps({
    QuizIntro: {
        type: Object,
        default: () => ({})
    }
});

</script>


<style scoped>

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
  
}

.animate-parent {
  opacity: 0;
  animation: fadeIn 1s ease-out forwards;
}



</style>