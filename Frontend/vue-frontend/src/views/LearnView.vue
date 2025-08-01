<script setup lang="ts">
import ProgressCircle from '@/components/learn/learnUI/ProgressCircle.vue';
import LessonCard from '@/components/learn/learnUI/LessonCard.vue';
import { RouterLink, useRoute } from 'vue-router';
import { useLearningStore } from '@/stores/learning';
import { ChevronDown } from 'lucide-vue-next';
import vector from '/Home/vector path.svg'
import vector2 from '/Home/vector path2.svg'
import { onMounted } from 'vue';
const learningStore = useLearningStore();
const route = useRoute();


onMounted(() => {
    learningStore.fetchLessons();
});

</script>


<template>

    <div>
        <p class="font-bold text-3xl mb-4">Learning</p>

        <div class="grid grid-cols-1">
            <RouterLink v-for="(lesson, index) in learningStore.lessons" :key="lesson.id"
                :to="`${route.path}/${lesson.id}`">

                <div
                    :class="['border-10  p-2 rounded-4xl', lesson.locked ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer border-accent animate-pulse']">

                    <LessonCard :progress="75" :title="lesson.title" :image="lesson.image" :bg="lesson.bg"
                        :locked="lesson.locked" />

                </div>

                <div class="relative left-1/2 transform -translate-x-1/2 flex justify-center items-center">
                    <div class="w-3 h-10" :class="lesson.locked ? 'bg-secondary grayscale-50' : 'bg-accent animate-pulse'"></div>
                </div>

                <!-- <div  class="w-full flex justify-center">
                    <img class="w-50 h-50 opacity-70" :src="pathimage[index + 1]" alt="">
                </div> -->
            </RouterLink>
        </div>
    </div>
</template>