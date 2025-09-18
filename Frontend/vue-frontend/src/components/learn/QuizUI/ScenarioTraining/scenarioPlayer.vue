<script script setup lang="ts">
import LearningContent from '../../content/UI/Learning/Core/LearningContent.vue';
import type { ScenarioStep } from '@/components/learn/QuizUI/ScenarioTraining/type';
import Story from './story.vue'
import { computed, ref } from 'vue';
import ScenarioMCQ from './scenarioMCQ.vue'
import Timer from '../timer.vue'

defineOptions({
  name: "ScenarioTraining"
})

const emit = defineEmits(['finish']);

const props = defineProps<{
    questions: ScenarioStep[];
}>();

const timerRef = ref<InstanceType<typeof Timer> | null>(null);
const currentIndex = ref(0);
const currentScenario = computed(() =>props.questions[currentIndex.value]);

const toggleNext = () => {
    if (currentIndex.value < props.questions.length - 1) {
        currentIndex.value++;
    } else {
        finish(timerRef.value?.timeLeft || 0);
    }
}
const togglePrev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
}
const score = ref(0);
const finish = ($event: number) => {
    emit('finish', score.value + storyCount.value, $event);
}

const storyCount = computed(() =>
    props.questions.filter(q => q.type === 'story').length
);

</script>
<template>
    <LearningContent>
        <Timer class="w-xl" ref="timerRef" @time-up="finish($event)"/>
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