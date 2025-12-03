<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Clock, FileText, Users, Zap, ArrowLeft, CircleCheck, Wrench, Save, X, Plus, Trash2, Target, Coins } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRoute, useRouter } from 'vue-router';
import { useAssessmentStore } from '@/stores/assessment';
import type { Assessment, AssessmentSession, AssessmentReward } from '@/services/assessmentService';
import { useAuthStore } from '@/stores/auth';
import AssessmentStartDialog from './AssessmentStartDialog.vue'
import { useRewardStore } from '@/stores/reward';
import Loading from '../loading.vue';

const props = defineProps<{
    id?: string;
}>();

const route = useRoute();
const router = useRouter();

// Edit mode state
const isEditing = ref(false);
const editableAssessment = ref<Assessment | null>(null);

const auth = useAuthStore();
const assessmentStore = useAssessmentStore();
const assessment = ref<Assessment | null>(null);
const session = ref<AssessmentSession | null>(null);
const resume_session = ref<AssessmentSession | null>(null);
const has_claimed_reward = ref<boolean>(false);
const session_reward = ref<AssessmentReward | null>(null);
const rewardStore = useRewardStore();
const isLoading = ref(true);

onMounted(async () => {

    isLoading.value = true;
    try {
        await assessmentStore.detail(route.params.id as string);
        assessment.value = assessmentStore.currentAssessment;
        session.value = await assessmentStore.has_completed_assessment(assessment.value!.id);
        resume_session.value = await assessmentStore.resume_assessment(assessment.value!.id);
    
        session_reward.value = await assessmentStore.fetch_ready_claim_reward(assessment.value!.id);
        has_claimed_reward.value = session_reward.value.rewarded;
        
        editableAssessment.value = assessment.value ? {
            ...assessment.value,
            instructions: assessment.value.instructions ? [...assessment.value.instructions] : []
        } : null;
    } finally {
        isLoading.value = false;
    }
});

// Navigation functions
const goBack = () => {
    router.push('/assessments');
};

const startAssessment = async () => {
    const initial_session = await assessmentStore.initialize_assessment(assessment.value!.id);
    router.push({ name: 'AssessmentSession', params: { id: initial_session.session_id } });
    // Add your navigation logic here
};
const editAssessment = async () => {
    // const initial_session = await assessmentStore.initialize_assessment(assessment.value!.id);
    router.push({ name: 'AssessmentEdittable', params: { id: assessment.value?.slug } });
    // Add your navigation logic here
};

const viewReport = () => {
    router.push({ name: 'AssessmentReport', params: { a_id: assessment.value?.slug, s_id: session.value?.session_id } });
};

// Edit functions

const addInstruction = () => {
    if (!editableAssessment.value) return;
    if (!editableAssessment.value.instructions) {
        editableAssessment.value.instructions = [];
    }
    
    editableAssessment.value.instructions.push('New instruction');
};

const removeInstruction = (index: number) => {
    if (!editableAssessment.value?.instructions) return;
    
    editableAssessment.value.instructions.splice(index, 1);
};

const toggleEdit = () => {
    if (isEditing.value) {
        editableAssessment.value = assessment.value ? { 
            ...assessment.value,
            instructions: assessment.value.instructions ? [...assessment.value.instructions] : []
        } : null;
    } else {
        editableAssessment.value = assessment.value ? { 
            ...assessment.value,
            instructions: assessment.value.instructions ? [...assessment.value.instructions] : []
        } : null;
    }
    isEditing.value = !isEditing.value;
};


const cancelEdit = () => {
    editableAssessment.value = assessment.value ? { 
        ...assessment.value,
        instructions: assessment.value.instructions ? [...assessment.value.instructions] : []
    } : null;
    isEditing.value = false;
};

const saveChanges = async () => {
    if (!editableAssessment.value) return;

    try {
        if (JSON.stringify(assessment.value) === JSON.stringify(editableAssessment.value)) {
           
            isEditing.value = false;
            return;
        }
        await assessmentStore.update(editableAssessment.value);
        assessment.value = { ...editableAssessment.value };

        isEditing.value = false;

        console.log('Assessment updated successfully');
    } catch (error) {
        console.error('Error updating assessment:', error);
        // Handle error (show toast, etc.)
    }
};

const claim_reward = async (assessment_id: number) => {
    try {
        has_claimed_reward.value = await assessmentStore.claim_reward(assessment_id);
        
        alert(assessment.value?.coin_points || 0)
        rewardStore.increaseUserRewards(    
            rewardStore.REASONS.assessment, 
            assessment.value?.coin_points || 0, 
            assessment.value?.exp_points || 0
        );

    } catch (error) {
        console.error('Error claiming assessment reward:', error)
    }
}

const showModal = ref(false)
const toggleShowModal = () => {
    showModal.value = !showModal.value;
}
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <main class="space-y-8">
            <!-- Assessment not found -->
            <Loading v-if="isLoading" />
            <div v-else-if="!assessment" class="text-center py-12">
                <h2 class="text-2xl font-bold text-foreground">Assessment not found</h2>
            </div>

            <!-- Main content -->
            <template v-else>
                <!-- Breadcrumb -->
                <div @click="goBack" class="flex gap-2 mb-5 text-sm items-center text-accent font-bold cursor-pointer">
                    <ArrowLeft :size="15"></ArrowLeft> Back
                </div>

                <!-- Main Content -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column -->
                    <div class="lg:col-span-2 space-y-8">
                        <!-- Header Section -->
                        <div>
                            <div class="flex justify-between items-center">
                                <!-- Editable Title -->
                                <div class="flex-1 mr-4">
                                    <h1 v-if="!isEditing" class="text-4xl font-bold text-foreground mb-4 font-display">
                                        {{ assessment.name }}
                                    </h1>
                                    <Input v-else v-model="editableAssessment!.name"
                                        class="text-4xl font-bold mb-4 text-foreground bg-transparent border-2 border-dashed border-accent"
                                        placeholder="Assessment name" />
                                </div>

                                <!-- Edit Controls -->
                                <div v-if="useAuthStore().User.is_admin" class="flex items-center gap-2">
                                    <template v-if="!isEditing">
                                        <Button @click="toggleEdit" size="sm" variant="ghost">
                                            <Wrench class="text-yellow-500 size-5" />
                                        </Button>
                                    </template>
                                    <template v-else>
                                        <Button @click="saveChanges" size="sm" variant="default"
                                            class="bg-green-600 hover:bg-green-700">
                                            <Save class="size-4 mr-1" />
                                            Save
                                        </Button>
                                        <Button @click="cancelEdit" size="sm" variant="outline">
                                            <X class="size-4 mr-1" />
                                            Cancel
                                        </Button>
                                    </template>
                                </div>

                              
                            </div>

                            <!-- Editable Metadata Bar -->
                            <div class="flex flex-wrap items-center gap-6 py-4 border-y border-border">
                                <div class="flex items-center gap-2 text-muted-foreground">
                                    <Clock class="h-5 w-5" />
                                    <template v-if="!isEditing">
                                        <span class="text-sm">{{ assessment.duration }} mins</span>
                                    </template>
                                    <template v-else>
                                        <Input v-model.number="editableAssessment!.duration" type="number"
                                            class="w-20 h-6 text-sm" min="1" />
                                        <span class="text-sm">mins</span>
                                    </template>
                                </div>

                                <div class="flex items-center gap-2 text-muted-foreground">
                                    <FileText class="h-5 w-5" />
                                    <template v-if="!isEditing">
                                        <span class="text-sm">{{ assessment.question_count }} questions</span>
                                    </template>
                                    <template v-else>
                                        <Input v-model.number="editableAssessment!.question_count" type="number"
                                            class="w-20 h-6 text-sm" min="1" />
                                        <span class="text-sm">questions</span>
                                    </template>
                                </div>

                                <div class="flex items-center gap-2 text-muted-foreground">
                                    <Zap class="h-5 w-5" />
                                    <template v-if="!isEditing">
                                        <span class="text-sm">{{ assessment.exp_points }} PX</span>
                                    </template>
                                    <template v-else>
                                        <Input v-model.number="editableAssessment!.exp_points" type="number"
                                            class="w-20 h-6 text-sm" min="0" />
                                        <span class="text-sm">PX</span>
                                    </template>
                                </div>

                                <div class="flex items-center gap-2 text-muted-foreground">
                                    <Coins class="h-5 w-5" />
                                    <template v-if="!isEditing">
                                        <span class="text-sm">{{ assessment.coin_points }} PX</span>
                                    </template>
                                    <template v-else>
                                        <Input v-model.number="editableAssessment!.coin_points" type="number"
                                            class="w-20 h-6 text-sm" min="0" />
                                        <span class="text-sm">PX</span>
                                    </template>
                                </div>

                                <div class="flex items-center gap-2 text-muted-foreground">
                                    <Target class="h-5 w-5" />
                                    <template v-if="!isEditing">
                                        <span class="text-sm">Passing Rate: {{ assessment.passing_rate }}%</span>
                                    </template>
                                    <template v-else>
                                        <Input v-model.number="editableAssessment!.passing_rate" type="number"
                                            class="w-20 h-6 text-sm" min="0" max="100" />
                                        <span class="text-sm">%</span>
                                    </template>
                                </div>

                            </div>
                        </div>

                        <!-- CTA Button -->
                        <div class="flex items-center gap-4">
                            <Button v-if="auth.User.is_admin" size="lg" class="bg-accent hover:bg-accent/50 text-white"
                                @click="editAssessment()" :disabled="isEditing">
                                Edit Questions
                            </Button>
                            <div v-else class="flex flex-col lg:flex-row items-center gap-4">
                                <Button size="lg" class="bg-accent hover:bg-accent/50 text-white w-full lg:w-auto"
                                    @click="toggleShowModal" :disabled="isEditing">
                                    {{ resume_session ? 'Resume assessment' : (!session ? 'Start assessment' : 'Retake assessment') }}
                                </Button>
    
                                <AssessmentStartDialog v-if="showModal"
                                    :data="assessment"
                                    @toggle="toggleShowModal" 
                                    @start-assessment="startAssessment" />
    
                                <Button v-if="session" size="lg" variant="outline" 
                                    class="w-full lg:w-auto"
                                    @click="viewReport" :disabled="isEditing">
                                    View Report
                                </Button>
                                
                                <div v-if="!session" class="flex items-center gap-1 text-ternary">
                                    <CircleCheck class="size-5" />
                                    <p class="text-sm">Incomplete</p>
                                </div>
                                
                                <div v-else class="flex items-center gap-1">
                                    <CircleCheck class="size-5 text-green-500" />
                                    <p class="text-xs font-semibold text-center lg:text-left">
                                        Last Completed {{ session?.completed_at ? new Date(session.completed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) : 'N/A' }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- About Section -->
                        <div class="space-y-4">
                            <h2 class="text-2xl font-bold text-foreground font-display">
                                About the {{ isEditing ? editableAssessment?.name : assessment.name }} assessment
                            </h2>

                            <!-- Editable Description -->
                            <template v-if="!isEditing">
                                <p class="text-muted-foreground leading-relaxed">{{ assessment.description }}</p>
                            </template>
                            <template v-else>
                                <Textarea v-model="editableAssessment!.description"
                                    class="min-h-[100px] border-2 border-dashed border-accent"
                                    placeholder="Assessment description" />
                            </template>

                            <div class="pt-2">
                                <p class="text-sm text-muted-foreground">
                                    <strong>Skill Level: </strong>
                                    <template v-if="!isEditing">
                                        {{ assessment.difficulty_level }}
                                    </template>
                                    <template v-else>
                                        <select v-model="editableAssessment!.difficulty_level"
                                            class="ml-2 px-2 py-1 border rounded text-foreground bg-background">
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert</option>
                                        </select>
                                    </template>
                                </p>
                            </div>
                        </div>

                        <!-- Instructions Section -->
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <h2 class="text-2xl font-bold text-foreground font-display">Instructions</h2>
                                <template v-if="isEditing">
                                    <Button @click="addInstruction" size="sm" variant="outline" class="text-sm">
                                        <Plus class="size-4 mr-1" />
                                        Add Instruction
                                    </Button>
                                </template>
                            </div>

                            <template v-if="!isEditing">
                                <ul class="list-disc pl-5 space-y-2 text-muted-foreground">
                                    <li v-for="(value, key) in assessment.instructions" :key="key">
                                        {{ value }}
                                    </li>
                                </ul>
                            </template>

                            <template v-else>
                                <div class="space-y-3">
                                    <div v-for="(instruction, index) in editableAssessment!.instructions" :key="index"
                                        class="flex items-start gap-2 p-3 border-2 border-dashed border-accent rounded-lg">
                                        
                                        <span class="text-sm text-muted-foreground mt-2 font-mono">{{ index + 1
                                            }}.</span>
                                        <Textarea v-if="editableAssessment?.instructions" v-model="editableAssessment!.instructions[index]"
                                            class="flex-1 min-h-[60px] resize-none"
                                            :placeholder="`Instruction ${index + 1}`" />
                                        <Button @click="removeInstruction(index)" size="sm" variant="ghost"
                                            class="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1">
                                            <Trash2 class="size-4" />
                                        </Button>
                                    </div>

                                    <!-- Add instruction button if no instructions exist -->
                                    <div v-if="!editableAssessment!.instructions?.length" class="text-center py-8">
                                        <p class="text-muted-foreground mb-4">No instructions added yet.</p>
                                        <Button @click="addInstruction" variant="outline">
                                            <Plus class="size-4 mr-2" />
                                            Add First Instruction
                                        </Button>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <!-- Reward box updated -->
                        <div v-if="session_reward" class="flex flex-col gap-3 items-center p-2 border-2 rounded-lg shadow-md bg-yellow-900/20 text-slate-300 border-yellow-500/40">
                            <div class="flex items-center gap-2">
                                <Zap class="w-5 h-5 text-yellow-400 dark:text-yellow-300 animate-pulse" />
                                <span class="text-sm font-semibold text-yellow-500">
                                    Reward: +{{ assessment.exp_points }} PX
                                </span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Coins class="w-5 h-5 text-yellow-400 dark:text-yellow-300 animate-pulse" />
                                <span class="text-sm font-semibold text-yellow-600 dark:text-yellow-300">
                                    Reward: +{{ assessment.coin_points }} Coins
                                </span>
                            </div>
                            <Button :disabled="has_claimed_reward" class="bg-yellow-600 text-black font-bold w-full" @click="claim_reward(assessment!.id)">
                                {{ has_claimed_reward ? 'Claimed' : 'Claim' }}
                            </Button>
                        </div>

                        <div
                            class="border border-border rounded-lg p-6 bg-background/50 space-y-4 sticky top-0 self-start">
                            <div class="w-full aspect-square rounded-lg bg-gradient-to-br flex items-center justify-center border"
                                :style="{ backgroundColor: isEditing ? editableAssessment?.bg : assessment.bg }">
                                <img :src="String(isEditing ? editableAssessment?.image : assessment.image)"
                                    class="object-contain" alt="">
                            </div>

                            <!-- Value Proposition -->
                            <div class="space-y-2">
                                <h3 class="font-bold text-foreground">Measure & benchmark your skills</h3>
                                <p class="text-sm text-muted-foreground">
                                    Discover your skill level and receive customized learning recommendations.
                                </p>
                            </div>

                            <!-- Start Button -->
                            <Button size="lg" class="w-full bg-accent hover:bg-accent/50 text-white"
                                @click="toggleShowModal" :disabled="isEditing">
                                
                                {{ resume_session ? 'Resume assessment' : (!session ? 'Start assessment' : 'Retake assessment') }}
                            </Button>
                            
                            <!-- Points Badge -->
                            <div class="flex items-center justify-center gap-2 py-2 px-3">
                                <Zap class="h-4 w-4 text-primary" />
                                <span class="text-sm font-medium text-primary">
                                    Earn {{ isEditing ? editableAssessment?.exp_points : assessment.exp_points }} PX
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </main>
    </div>
</template>

<style scoped>
/* Add some visual feedback for editable fields */
.border-dashed {
    border-style: dashed !important;
}
</style>