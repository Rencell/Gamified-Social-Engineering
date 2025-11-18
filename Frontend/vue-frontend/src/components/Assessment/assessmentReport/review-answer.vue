<template>
  <div class="space-y-6 w-full">
    <!-- Stats Bar -->
    <p class="uppercase font-bold">Your risk assessment</p>
    <div class="flex items-baseline gap-1">
        <span class="text-6xl font-bold text-slate-50">{{ score }}</span>
        <span class="text-2xl text-slate-400">/{{ totalQuestions }}</span>
    </div>
    
    <div class="space-y-3">
      <div
        v-for="(answer, index) in shib"
        :key="answer.id"
        :class="[
          'rounded-lg border transition-colors',
          answer.is_correct
            ? 'border-emerald-500/30 bg-emerald-500/5'
            : 'border-red-500/30 bg-red-500/5'
        ]"
      >
        <button
          @click="toggleExpanded(answer.id)"
          class="w-full flex items-start gap-4 p-4 hover:bg-slate-800/30 transition-colors"
        >
          <!-- Question Number & Status -->
          <div class="flex-shrink-0 flex items-center gap-3">
            <span class="text-sm font-semibold text-slate-400 w-6">Q{{ index + 1 }}</span>
            <div
              :class="[
                'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                answer.is_correct
                  ? 'bg-emerald-500 text-white'
                  : 'bg-red-500 text-white'
              ]"
            >
              {{ answer.is_correct ? '✓' : '✗' }}
            </div>
          </div>

          <!-- Question Content -->
          <div class="flex-1 text-left">
            <p class="text-slate-50 font-medium mb-1">{{ answer.question.text }}</p>
          </div>

          <!-- Expand Icon -->
          <ChevronDown
            :class="[
              'w-5 h-5 text-slate-400 transition-transform flex-shrink-0',
              expandedId === answer.id ? 'rotate-180' : ''
            ]"
          />
        </button>

        <!-- Expanded Answer -->
        <div
          v-if="expandedId === answer.id"
          class="px-4 pb-4 border-t border-slate-700/50 space-y-3"
        >
          <div>
            <p class="text-xs text-slate-400 uppercase tracking-wide mb-2 mt-7">Your Answer</p>
            <p :class="[
              'text-sm',
              answer.is_correct ? 'text-emerald-300' : 'text-red-300'
            ]">
              {{ answer.selected_option?.text || 'No answer selected' }}
            </p>
          </div>
          
          <div v-if="!answer.is_correct">
            <p class="text-xs text-slate-400 uppercase tracking-wide mb-2">Correct Answer</p>
            <p class="text-sm text-emerald-300">
              {{ getCorrectAnswer(answer.question) }}
            </p>
          </div>
          
          <div>
            <p class="text-xs text-slate-400 uppercase tracking-wide mb-2">Explanation</p>
            <p class="text-sm text-slate-400">
              {{ answer.question.explanation || 'This question tests your understanding of the topic. Review the recommended resources to strengthen this area.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-slate-400">Loading assessment results...</p>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && shib.length === 0" class="text-center py-8">
      <p class="text-slate-400">No assessment results found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { AssessmentService } from '@/services';
import type { AssessmentAnswer, Question } from '@/services/assessmentService';

const router = useRouter();
const shib = ref<AssessmentAnswer[]>([]);
const loading = ref(true);
const expandedId = ref<number | null>(null);

// Computed properties for stats
const score = computed(() => {
  return shib.value.filter(answer => answer.is_correct).length;
});

const totalQuestions = computed(() => {
  return shib.value.length;
});

const accuracy = computed(() => {
  if (totalQuestions.value === 0) return 0;
  return Math.round((score.value / totalQuestions.value) * 100);
});

// Methods
const toggleExpanded = (answerId: number) => {
  expandedId.value = expandedId.value === answerId ? null : answerId;
};

const getCorrectAnswer = (question: Question) => {
  const correctOption = question.options?.find(option => option.is_correct);
  return correctOption?.text || 'No correct answer found';
};

// Load assessment results
onMounted(async () => {
  try {
    const sessionId = router.currentRoute.value.params.id as string;
    if (sessionId) {
      shib.value = await AssessmentService.fetch_assessment_results(sessionId);
    }
  } catch (error) {
    console.error('Error loading assessment results:', error);
  } finally {
    loading.value = false;
  }
});

// Props (keeping for backward compatibility)
interface Answer {
  questionNumber: number;
  question: string;
  userAnswer: string;
  isCorrect: boolean;
  category: string;
}

interface Props {
  answers?: Answer[];
}

const props = withDefaults(defineProps<Props>(), {
  answers: () => []
});
</script>

<style scoped>
/* Add any additional custom styles if needed */
</style>