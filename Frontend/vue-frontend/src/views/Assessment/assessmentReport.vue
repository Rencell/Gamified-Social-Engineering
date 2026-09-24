<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { X, Share2, Eye, BarChart3 } from 'lucide-vue-next';
import ReviewAnswer from '@/components/Assessment/assessmentReport/review-answer.vue'
import { useRoute, useRouter } from 'vue-router';
import { Select, SelectContent, SelectItem, SelectItemText, SelectTrigger } from '@/components/ui/select';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import LessonCard, { type LessonRecommendation } from '@/components/Assessment/LessonCard.vue';
import { AssessmentService } from '@/services';
import { useAssessmentStore } from '@/stores/assessment';
import { useAuthStore } from '@/stores/auth';
import type { AssessmentRecommendedModules } from '@/services/assessmentService';

const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();
const selectedAttempt = ref('Attempt #2 (UX)');
interface AttemptOption { value: string; label: string }
const attemptOptions = ref<AttemptOption[]>([]);
const recommended_modules = ref<AssessmentRecommendedModules[]>([]);
const goBack = () => {
    router.push({ name: 'Assessments' })
};

watch(selectedAttempt, (newVal) => {
    window.location.href = `/assessment/${route.params.a_id}/session/${newVal}/report`;
});

const assessmentStore = useAssessmentStore();
onMounted(async () => {
    const assessmentId = route.params.a_id as string;
    const sessionId = route.params.s_id as string;
    await assessmentStore.detail(assessmentId);
    const response = await AssessmentService.assessment_report(assessmentId);
    recommended_modules.value = await AssessmentService.fetch_recommended_modules(sessionId);
    response.forEach((element, index) => {
        attemptOptions.value.push(
            { value: element.session_id, label: `Attempt #${index + 1}` });
    });
});

const lessonRecommendations = computed<LessonRecommendation[]>(() => {
    return (recommended_modules.value || []).map((rec) => {
        const lesson = rec.lesson;
        const modules = (rec.modules || []).map((m) => ({
            id: (m.id ?? m.slug ?? m.title) as string | number,
            title: m.title,
            description: `Accuracy: ${Math.round((m.accuracy ?? 0) * 10) / 10}% • Quiz: ${m.content_quiz}`,
        }));

        return {
            id: lesson.id,
            iconUrl: typeof lesson.image === 'string' ? lesson.image : undefined,
            title: lesson.title,
            slug: lesson.slug,
            instructor: 'Recommended for you',
            description: lesson.description,
            difficulty: 'Recommended',
            duration: undefined,
            rating: undefined,
            ratingCount: undefined,
            modules,
        } satisfies LessonRecommendation;
    });
});
</script>
<template>

   <!-- <pre>{{ recommended_modules }}</pre> -->
    <div class="min-h-screen flex justify-center bg-background text-slate-50 p-6 ">
        <div class="w-5xl">
            <div class="flex items-center justify-between mb-12 ">
                <button class="text-slate-400 hover:text-slate-200 transition-colors">
                    <X class="w-6 h-6" @click="goBack" />
                </button>
                <button
                    class="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:text-slate-100 hover:border-slate-600 transition-colors text-sm">
                    <Share2 class="w-4 h-4" />
                    Share
                </button>
            </div>

            <!-- Main Content -->
            <div class="max-w-7xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Left Column - Score Section -->
                    <div class="col-span-2">
                        <p class="text-slate-400 text-sm mb-4">Assessment report</p>
                        <h1 class="text-4xl font-bold mb-6 text-slate-50">{{ assessmentStore.currentAssessment?.name }}</h1>

                        <!-- Description -->
                        <p class="text-slate-400 mb-4 leading-relaxed">
                            Your assessment report is ready.
                        </p>
                        
                        <!-- Credentials & Date -->
                        <div class="flex items-center gap-4 mb-8 text-sm text-slate-400">
                            <div class="flex items-center gap-2">
                                <span class="text-blue-400">✓</span>
                                <span>Credentials verified</span>
                            </div>
                            <span>•</span>
                            <span>—</span>
                        </div>

                        <!-- Attempt Selector & Actions -->
                        <div class="flex items-center gap-4 mb-12">
                            <Select v-model="selectedAttempt" :default-value="selectedAttempt">
                                <SelectTrigger id="question-type" class="!bg-background !text-white">
                                    <SelectValue placeholder="Attempt"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="opt in attemptOptions" :key="opt.value" :value="opt.value">
                                        <SelectItemText>{{ opt.label }}</SelectItemText>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <button
                                class="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 transition-colors text-sm">
                                <BarChart3 class="w-4 h-4" />
                                Skill graph impact
                            </button>
                            <button
                                class="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 transition-colors text-sm">
                                <Eye class="w-4 h-4" />
                                Review answers
                            </button>
                        </div>

                        <!-- Score Display Section -->
                        <div class="space-y-8">
                            <div class="flex flex-col items-start gap-8">
                                <!-- Score Value -->
                                <!-- <Score/> -->
                                <ReviewAnswer />
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - User Card -->
                    <div class="col-span-1">
                        <div class="border border-slate-700 rounded-lg p-6 space-y-6">
                            <!-- Avatar -->
                            <div class="flex justify-center">
                                <img src="https://cdn-icons-png.flaticon.com/512/3273/3273898.png"
                                    :alt="authStore.User?.username ?? 'User'"
                                    class="w-24 h-24 rounded-full object-cover ring-2 ring-slate-700" />
                            </div>

                            <!-- User Info -->
                            <div class="text-center">
                                <h3 class="font-semibold text-slate-50 mb-1">{{ authStore.User?.username }}</h3>
                                <p class="text-sm text-slate-400">—</p>
                            </div>


                            <!-- Assessment Info -->
                            <div class="border-t border-slate-700 pt-4">
                                <p class="text-xs text-slate-500 uppercase tracking-wide mb-3">From Assessment</p>
                                <div class="flex items-center gap-2 text-sm">
                                    <div
                                        class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                                        ✓
                                    </div>
                                    <div>
                                        <p class="font-semibold text-slate-50">{{ assessmentStore.currentAssessment?.name }}</p>
                                        <p class="text-xs text-slate-400">{{ assessmentStore.currentAssessment?.duration }} mins · {{
                                            assessmentStore.currentAssessment?.question_count }} questions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recommendations Section -->
                <div class="mt-16 border-t border-slate-700 pt-8">
                    <h2 class="text-lg font-semibold text-slate-50 mb-3">Recommendations</h2>
                    <p class="text-sm mb-3 text-slate-400">
                        These personalized recommendations are based on your skill gaps. Start one now to improve your skills.
                    </p>

                    <div v-if="lessonRecommendations.length === 0" class="text-sm text-slate-400">
                        No recommendations available.
                    </div>

                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <LessonCard
                            v-for="lesson in lessonRecommendations"
                            :key="String(lesson.id ?? lesson.title)"
                            :lesson="lesson"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
/* Add any custom styles here if needed */
.transition-colors {
    transition-property: color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}
</style>