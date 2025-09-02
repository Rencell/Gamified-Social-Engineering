<script script setup lang="ts">
import LearningContent from '../../content/UI/Learning/Core/LearningContent.vue';
import type { ScenarioStep } from '@/components/learn/QuizUI/ScenarioTraining/type';
import Story from './story.vue'
import { computed, ref } from 'vue';
import ScenarioMCQ from './scenarioMCQ.vue'

defineOptions({
  name: "ScenarioTraining"
})

const emit = defineEmits(['finish']);

const props = defineProps<{
    questions: ScenarioStep[];
}>();

const currentIndex = ref(0);
const currentScenario = computed(() =>props.questions[currentIndex.value]);

const toggleNext = () => {
    if (currentIndex.value < props.questions.length - 1) {
        currentIndex.value++;
    } else {
        finish();
    }
}
const togglePrev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
}
const score = ref(0);
const finish = () => {
    emit('finish', score.value + storyCount.value);
}

const storyCount = computed(() =>
    props.questions.filter(q => q.type === 'story').length
);

</script>
<template>
    <LearningContent>
        <Story v-if="currentScenario.type == 'story'" 
        :key="currentIndex"
        :data="currentScenario"
        @toggleNext="toggleNext" />
        
        <ScenarioMCQ v-else 
        :key="currentIndex + 1"
        :mcq="currentScenario" 
        @togglePrev="togglePrev"
        @toggleNext="toggleNext"
        @addScore="score += 1"/>

    </LearningContent>
</template>