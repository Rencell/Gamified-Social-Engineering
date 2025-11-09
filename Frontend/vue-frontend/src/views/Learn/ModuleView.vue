<script setup lang="ts">
import { ArrowLeft} from 'lucide-vue-next';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import ModuleCard from '@/components/learn/learnUI/ModuleCard.vue'
import { useLearningStore } from '@/stores/learning'
import { computed, onMounted, ref } from 'vue';
import LessonDetailCard from '@/components/learn/learnUI/LessonDetailCard.vue';
import { useModuleStore } from '@/stores/module';
import { useLessonStore } from '@/stores/lesson';
import CreateModuleDialog from '@/components/learn/dialog/Lesson/Section/Module/createModuleDialog.vue';
import quizService, { type Quiz } from '@/services/quizService';
import { useSectionStore } from '@/stores/sections';
import CreateSectionDialog from '@/components/learn/dialog/Lesson/Section/createSectionDialog.vue'
import type { Section } from '@/services/sectionService';
import SectionDivider from '@/components/learn/learnUI/SectionDivider.vue'
import moduleService from '@/services/moduleService';
import { useAuthStore } from '@/stores/auth';


const moduleStore   = useModuleStore();
const lessonStore   = useLessonStore();
const learningStore = useLearningStore()
const route         = useRoute()
const sectionStore  = useSectionStore();
const lessonId = route.params.lessonId as string;


const quizzes_progress  = ref<(Quiz & { percentage?: number })[]>()
const lesson_percentage = ref(0)
const sectionProgress   = ref<Record<number, number>>({});
const sectionRefs       = ref<Record<number, boolean>>({});

// Toggle visibility for a specific section
const toggleSectionVisibility = (sectionId: number) => {
    sectionRefs.value[sectionId] = !sectionRefs.value[sectionId];
};

onMounted(async () => {
    if (lessonStore.lessons.length === 0) {
        await lessonStore.fetchLessons();
    }

    lessonStore.setCurrentLesson(lessonId);
    await moduleStore.fetchModules(lessonId);

    await sectionStore.fetchSection(lessonStore.currentLesson?.id || 0);
    sectionStore.sections.forEach((section) => {
        sectionRefs.value[section.id] = true; // Default to visible
    });

    try {
        const map = moduleStore.modules.map(m => m.id).filter((id): id is number => id !== null);
        
        await quizService.get_by_ids(map).then(res => {
            quizzes_progress.value = res;
        }).catch(err => {
            console.error("Error fetching quizzes by IDs:", err);
        });

        // Calculate progress for each section
        sectionStore.sections.forEach((section) => {
            const totalProgress = section.modules.reduce((acc, module) => {
                const moduleProgress = module.accuracy || 0;
                return acc + moduleProgress;
            }, 0);
            const moduleCount = section.modules.length || 1; // Avoid division by zero
            sectionProgress.value[section.id] = Math.round(totalProgress / moduleCount);
            lesson_percentage.value = Math.round((lesson_percentage.value + sectionProgress.value[section.id]));
        });
        
        lesson_percentage.value = Math.round(lesson_percentage.value / sectionStore.sections.length);
    } catch (err) {
        console.error("Error in fetching lessons or modules:", err);
    }
})


const isFinalLocked = (section: Section) => {
   
    const nonFinal = section.modules.filter(m => !m.final)
    const anyUnlocked = nonFinal.every(m => m.locked === false)

    return anyUnlocked
}

const tayp = ref<any>(null)
const get_all_modules = async () => {
    try {
        const modules = await sectionStore.fetchSection(lessonStore.currentLesson?.id || 0);
        tayp.value = sectionStore.sections
        console.log("All Modules:", modules);
    } catch (error) {
        console.error("Error fetching all modules:", error);
    }
}

get_all_modules();

// helper function that returns the first locked module of a section
const getFirstLockedModule = (section) => {
  return section.modules.find(m => m.locked === true)
}
</script>

<template>
    <div class="p-2 sm:p-0">
        <RouterLink :to="{ name: 'Learn' }">
            <div class="flex gap-2 mb-5 text-sm items-center text-accent font-bold">
                <ArrowLeft :size="15"></ArrowLeft> Back
            </div>
        </RouterLink>

        <LessonDetailCard :progress="learningStore.completionPercentage"
            :description="lessonStore.currentLesson?.description" :title="lessonStore.currentLesson?.title"
            :image="lessonStore.currentLesson?.image" :bg="lessonStore.currentLesson?.bg"
            :locked="lessonStore.currentLesson?.locked" :module-count="moduleStore.modules.length" :isLatest="true"
            :lesson-module-unlocked="lessonStore.currentLesson?.completed_modules || 0"
            :lesson-percentage="lesson_percentage">
        </LessonDetailCard>

        <div class="flex flex-col mt-2 mb-20 sm:mb-10">
            <div class="my-2">
                <CreateSectionDialog />
                <hr class="my-5" />
            </div>
            <div v-for="(section, index) in sectionStore.sections" :key="section.name">

                <SectionDivider :index="index" :section="section" :section-progress="sectionProgress[section.id] || 0"
                    :sectionRefs="sectionRefs[section.id]" @toggle="toggleSectionVisibility(section.id)">

                    <div v-show="sectionRefs[section.id]">
                        <CreateModuleDialog :section-id="section.id" />

                        <ModuleCard v-for="(module, key) in section.modules" 
                            :lessonkey="key + 1" 
                            :key="module.title"
                            :module="module" 
                            :title="module.title"
                            :router-link="`/learn/${lessonId}/${section.id}/session`" 
                            :interactive="!module.locked"
                            @click="moduleStore.setSelectedModule(module)"
                            :locked-index="!lessonStore.currentLesson?.locked ? (module.final ? !isFinalLocked(section) : false) : !useAuthStore().User.is_admin"
                            :quiz-status="quizzes_progress?.find(q => q.module === module.id)"
                            :quiz-progress="module.accuracy" 
                            :highlight="module.id === getFirstLockedModule(section)?.id" />

                        
                    </div>
                </SectionDivider>
            </div>
        </div>
        <!-- <pre>{{ quizzes_progress?.find(q => q.id === 2) }}</pre> -->
        <RouterView />
    </div>
</template>