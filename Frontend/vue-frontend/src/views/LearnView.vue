<script setup lang="ts">
import ProgressCircle from '@/components/learn/learnUI/ProgressCircle.vue';
import LessonCard from '@/components/learn/learnUI/LessonCard.vue';
import { RouterLink, useRoute } from 'vue-router';
import { useLearningStore } from '@/stores/learning';
import { ChevronDown } from 'lucide-vue-next';
import vector from '/Home/vector path.svg'
import vector2 from '/Home/vector path2.svg'
const learningStore = useLearningStore();
const route = useRoute();

const pathimage: Record<string, string> = {
  '1': vector,
  '2': vector2,
};

</script>


<template>

    <div>
        <p class="font-bold text-3xl mb-4">Learning</p>

        <div class="grid grid-cols-1 gap-4">
            <RouterLink v-for="(lesson, index) in learningStore.lessons" :key="lesson.id" :to="`${route.path}/${lesson.id}`">
                
                <LessonCard :progress="75" :title="lesson.title" :image="lesson.image" :bg="lesson.bg" :locked="lesson.locked">

                </LessonCard>
                <div  class="w-full flex justify-center">
                    <img class="w-50 h-50 opacity-70" :src="pathimage[index + 1]" alt="">
                </div>
            </RouterLink>
        </div>
    </div>
</template>