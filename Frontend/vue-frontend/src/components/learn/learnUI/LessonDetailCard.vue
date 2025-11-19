<script setup lang="ts">
import ProgressCircle from '@/components/learn/learnUI/ProgressCircle.vue';
import { Button } from '@/components/ui/button';
import { LearnProgress } from '@/components/ui/progress';
import { ChevronDown, ChevronLeft, CircleCheck, Edit2, Lock, LockKeyhole, Plus, Trash2, Wrench } from 'lucide-vue-next';
import CreateDialog from '../dialog/Lesson/createDialog.vue';
import UpdateDialog from '../dialog/Lesson/updateDialog.vue';
import { useLessonStore } from '@/stores/lesson';
import type { Lesson_test } from '@/services/lessonService';
import DeleteAlert from '../dialog/Lesson/deleteAlert.vue'
import LessonProgress from './LessonProgress.vue'
import { computed, ref } from 'vue';
import { Input } from '@/components/ui/input';
import LearningBold from '../content/UI/Learning/Highlight/LearningBold.vue';
import { useAuthStore } from '@/stores/auth';

interface Props {
    title?: string | 'title not set'
    progress: number
    description?: string | 'description not set'
    image?: File | string | undefined
    bg?: string
    locked?: boolean
    moduleCount?: number
    isLatest?: boolean
    lessonModuleUnlocked?: number
    lessonPercentage?: number
}

// Add reactive state for expanded objectives
const expandedObjectives = ref(false);
const lessonStore = useLessonStore();

// Mock course data - replace with your actual course prop or data
const course = computed(() => ({
    objectives: lessonStore.currentLesson?.objective || []
}));

const props = defineProps<Props>()


const bgDefined = () => {
    if (props.locked) {
        return 'bg-secondary/30 border-[#35d1ac] ';
    }

    if (props.bg) {
        return `bg-[${props.bg}] brightness-90`;
    } else {
        return 'bg-[#4f1c51] ';
    }

}

const editObjective = ref(false);
const toggleEditObjective = () => {
    editObjective.value = !editObjective.value;
};

const save_objectives = async () => {
    await lessonStore.addObjective(course.value.objectives);
    editObjective.value = false;
};
</script>

<template>
   
    <div class="p-5 rounded-xl shadow-2xl duration-175 transition-all" :class="[bgDefined()]"
        :style="{ backgroundColor: props.bg && !props.locked ? props.bg : '' }">
        <!-- loading  -->


        <div class="flex items-center gap-4 justify-between mb-3">

            <div v-if="!locked" class="p-3">

                <LearnProgress class="w-50 sm:w-85" v-if="isLatest" :model-value="lessonModuleUnlocked!"
                    :tongue-color="props.bg" :module-count="moduleCount" position="right" :isLatest="isLatest">
                </LearnProgress>

                <div v-else class="flex items-center gap-3">
                    <CircleCheck class="text-green-500" />
                    <p class="font-bold text-primary">COMPLETED!</p>
                </div>
            </div>
            <div v-else class="border-3 w-15 h-15 bg-background rounded-full flex items-center justify-center">
                <LockKeyhole></LockKeyhole>
            </div>
            <div>
                <DeleteAlert :lesson-id="lessonStore.currentLesson?.id" />
                <UpdateDialog v-if="lessonStore.currentLesson" :lesson="lessonStore.currentLesson" />
            </div>
        </div>
        <!-- images -->
        <div class="flex justify-center py-3 lg:py-6 grow-0 shrink-0 relative">
            <div class="aspect-video md:aspect-h-5 w-full max-w-sm h-full flex items-center justify-center">
                <img :class="['object-scale-down mx-auto w-50 sm:w-75 relative z-20', locked ? 'grayscale-100' : '']"
                    :src="image ? image : '/Human.webp'" alt="">

                <div class="size-50 bg-white absolute rounded-full blur-2xl opacity-30">

                </div>
            </div>
        </div>

        <!-- Text -->
        <div class="flex flex-col justi-between grow">
            <h2 class="text-center font-bold text-2xl my-3">{{ title }}</h2>
            <p class="text-center text-gray-400 mb-2 text-xs font-bold">{{ description }}</p>
        </div>

        <LessonProgress :progress="lessonPercentage!" />

        <div class="border-t border-ternary pt-4">
            <button @click="expandedObjectives = !expandedObjectives"
                class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors text-left cursor-pointer">
                <span class="font-semibold">Module Objectives</span>
                <ChevronDown :size="20" :class="`transition-transform ${expandedObjectives ? 'rotate-180' : ''}`" />
            </button>

            <div v-if="expandedObjectives" class="mt-3 space-y-2 pl-3 border-l-2 border-purple-500">
                <Button v-if="useAuthStore().User.is_admin" @click="toggleEditObjective" size="sm" class="mb-2">
                    <Edit2 v-if="!editObjective"></Edit2>
                    <ChevronLeft v-else></ChevronLeft>
                    {{ editObjective ? 'Save' : 'Edit' }}
                </Button>
                <div v-if="!editObjective" class="space-y-2">
                    <div v-if="course.objectives.length <= 0">
                        No objectives set for this lesson.
                    </div>
                    <div v-for="(objective, index) in course.objectives" :key="index"
                        class="flex gap-3 text-sm text-purple-100">
                        <span class="text-purple-400 font-bold min-w-fit">{{ index + 1 }}.</span>
                        <LearningBold :text="objective" />
                    </div>
                </div>
                <div v-else class="space-y-2">
                    <div v-for="(objective, index) in course.objectives" :key="index" class="flex gap-3 text-sm text-purple-100 items-center">
                        <span class="text-purple-400 font-bold min-w-fit">{{ index + 1 }}.</span>
                        <Input 
                            v-model="course.objectives[index]" 
                            type="text"
                        />
                        <Button variant="destructive" @click="course.objectives.splice(index, 1)"><Trash2></Trash2></Button>
                    </div>
                    <div class="flex gap-3 mt-3">
                        <Button @click="course.objectives.push('New Objective')"><Plus></Plus>Add Objective</Button>
                        <Button @click="save_objectives" class="bg-green-800">Save</Button>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>