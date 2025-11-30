<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { X, Share2, Eye, BarChart3 } from 'lucide-vue-next';
import ReviewAnswer from '@/components/Assessment/assessmentReport/review-answer.vue'
import { useRoute, useRouter } from 'vue-router';
import { Select, SelectContent, SelectItem, SelectItemText, SelectTrigger } from '@/components/ui/select';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import { AssessmentService } from '@/services';
interface AssessmentData {
    assessmentName: string;
    score: number;
    maxScore: number;
    percentile: number;
    riskLevel: string;
    description: string;
    user: {
        name: string;
        title: string;
        community: string;
        followers: number;
        avatar: string;
    };
    date: string;
    attempt: string;
    duration: string;
    questionCount: number;
    credentialsVerified: boolean;
    recommendations: string[];
}

// Props (you can pass real data from parent component)
const props = defineProps<{
    sessionData?: any; // Replace with your actual session type
}>();

// Mock data (replace with real data from props or API)
const assessmentData = ref<AssessmentData>({
    assessmentName: 'Uxcel Pulse',
    score: 78,
    maxScore: 100,
    percentile: 1,
    riskLevel: 'High Performance',
    description: 'You received a score of 78. You performed better than 1% of all others that have taken this assessment.',
    user: {
        name: 'Tobelonia, Rencell, G',
        title: 'Art Director',
        community: 'COMMUNITY',
        followers: 0,
        avatar: '/professional-portrait.png'
    },
    date: 'Nov 16, 2025',
    attempt: 'Attempt #2 (UX)',
    duration: '25m',
    questionCount: 25,
    credentialsVerified: true,
    recommendations: [
        'Focus on user research methodologies',
        'Explore advanced prototyping techniques',
        'Study interaction design principles',
        'Review design system best practices'
    ]
});

// Generate chart bars with random heights
const chartBars = computed(() => {
    return Array.from({ length: 20 }, () => ({
        height: Math.random() * 100
    }));
});

// Functions for button actions
const handleShare = () => {
    console.log('Share assessment results');
    // Implement share functionality
};

const handleSkillGraph = () => {
    console.log('Show skill graph impact');
    // Navigate to skill graph page
};

const handleReviewAnswers = () => {
    console.log('Review answers');
    // Navigate to answer review page
};

const handleClose = () => {
    console.log('Close results');
    // Navigate back or close modal
};



const router = useRouter();
const route = useRoute();
const selectedAttempt = ref('Attempt #2 (UX)');
interface AttemptOption { value: string; label: string }
const attemptOptions = ref<AttemptOption[]>([]);

const goBack = () => {
    router.push({ name: 'Assessments' })
};

watch(selectedAttempt, (newVal) => {
    window.location.href = `/assessment/${route.params.a_id}/session/${newVal}/report`;
});

onMounted(async () => {
    // Fetch real assessment data here if needed

    const assessmentId = route.params.a_id as string;
    const response = await AssessmentService.assessment_report(assessmentId);
    response.forEach((element, index) => {
        attemptOptions.value.push(
            { value: element.session_id, label: `Attempt #${index + 1}` });
    });
});
</script>
<template>
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
                <div class="grid grid-cols-3 gap-8">
                    <!-- Left Column - Score Section -->
                    <div class="col-span-2">
                        <p class="text-slate-400 text-sm mb-4">Assessment report</p>
                        <h1 class="text-4xl font-bold mb-6 text-slate-50">{{ assessmentData.assessmentName }}</h1>

                        <!-- Description -->
                        <p class="text-slate-400 mb-4 leading-relaxed">
                            {{ assessmentData.description }}
                        </p>

                        <!-- Credentials & Date -->
                        <div class="flex items-center gap-4 mb-8 text-sm text-slate-400">
                            <div class="flex items-center gap-2">
                                <span class="text-blue-400">✓</span>
                                <span>Credentials verified</span>
                            </div>
                            <span>•</span>
                            <span>{{ assessmentData.date }}</span>
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
                                    :alt="assessmentData.user.name"
                                    class="w-24 h-24 rounded-full object-cover ring-2 ring-slate-700" />
                            </div>

                            <!-- User Info -->
                            <div class="text-center">
                                <h3 class="font-semibold text-slate-50 mb-1">{{ assessmentData.user.name }}</h3>
                                <p class="text-sm text-slate-400">{{ assessmentData.user.title }}</p>
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
                                        <p class="font-semibold text-slate-50">{{ assessmentData.assessmentName }}</p>
                                        <p class="text-xs text-slate-400">{{ assessmentData.duration }} · {{
                                            assessmentData.questionCount }} questions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recommendations Section -->
                <div class="mt-16 border-t border-slate-700 pt-8">
                    <h2 class="text-lg font-semibold text-slate-50 mb-6">Recommendations</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div v-for="(recommendation, index) in assessmentData.recommendations" :key="index"
                            class="flex gap-3 p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <div
                                class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                {{ index + 1 }}
                            </div>
                            <p class="text-sm text-slate-300">{{ recommendation }}</p>
                        </div>
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