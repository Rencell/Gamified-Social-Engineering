<script setup lang="ts">
import slide1 from '@/components/onboarding/slide1.vue';
import { computed, ref } from 'vue';

const currentIndex = ref(0);
const slides = [
    { component: slide1 },
]

const CurrentSlide = computed(() => slides[currentIndex.value].component);

const handleNext = () => {
    if (currentIndex.value < slides.length - 1) {
        currentIndex.value += 1;
    }
}

const handlePrev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value -= 1;
    }
}

</script>

<template>
    <div className="min-h-screen bg-background">

        <component 
            :is="CurrentSlide" 
            @next="handleNext" 
            @prev="handlePrev" />
    
    </div>
</template>