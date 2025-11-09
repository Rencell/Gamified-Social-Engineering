<script setup lang="ts">
import { Clock, FileText, AlertCircle, X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useRouter } from 'vue-router';
import { useAssessmentStore } from '@/stores/assessment';
import { onMounted, ref } from 'vue';
import { Spinner } from '@/components/ui/spinner';

const router = useRouter();
const assessment = useAssessmentStore();

const goBack = () => {
  router.back();
};

const openRules = () => {
  // Add your rules modal logic here
  console.log('Opening rules');
};

const openFAQs = () => {
  // Add your FAQs navigation logic here
  console.log('Opening FAQs');
};

const changeExperience = () => {
  // Add your experience change logic here
  console.log('Changing experience');
};

const startAssessment = async () => {
  // Add your assessment start logic here
  start.value = false;
  startCountdown();
  
};
const countdown = ref(5);
const start = ref(true);
let countdownInterval: ReturnType<typeof setInterval> | null = null;

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      // Countdown finished, show main content
      start.value = true;
      if (countdownInterval) {
        countdown.value = 5; // Reset countdown for next time
        clearInterval(countdownInterval);
      }
    }
  }, 1000);
};

</script>

<template>
  <div v-if="start" class="min-h-screen bg-background flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-center px-8 py-6">
      <button @click="goBack" class="text-slate-400 hover:text-slate-300 transition">
        <X :size="24" />
      </button>
      <div class="flex gap-3">
        <Button @click="openRules" variant="outline"
          class="text-slate-300 border-slate-700 hover:bg-slate-800 bg-transparent">
          <span class="inline-flex items-center gap-2">
            <div class="w-4 h-4 rounded-full border border-slate-400" />
            Rules
          </span>
        </Button>
        <Button @click="openFAQs" variant="outline"
          class="text-slate-300 border-slate-700 hover:bg-slate-800 bg-transparent">
          FAQs <span class="ml-1">↗</span>
        </Button>
      </div>
    </div>

    <!-- Main Content - Centered -->
    <div class="flex-1 flex items-center justify-center px-4">
      <div class="w-full max-w-xl flex flex-col items-center text-center">
        <!-- Logo Icon -->
        <div class="mb-6">
          <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-slate-900 font-bold text-lg">
            ⬡
          </div>
        </div>

        <!-- Heading -->
        <h1 class="text-4xl font-bold text-white mb-4 font-display">{{ assessment.currentAssessment?.name }}</h1>

        <!-- Description -->
        <p class="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
          Build your skill graph, get personalized learning recommendations, and benchmark your abilities.
        </p>

        <!-- Metadata -->
        <div class="flex items-center justify-center gap-6 mb-8 text-slate-400 text-sm">
          <div class="flex items-center gap-2">
            <Clock :size="18" />
            <span>{{ assessment.currentAssessment?.duration }} mins</span>
          </div>
          <div class="w-px h-4 bg-slate-700" />
          <div class="flex items-center gap-2">
            <FileText :size="18" />
            <span>25 questions</span>
          </div>
        </div>

        <!-- CTA Button -->
        <Button @click="startAssessment"
          class="w-full max-w-sm bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold mb-8 transition"
          size="lg">
          Get started
        </Button>

        <!-- Info Message -->
        <div class="flex items-center gap-2 text-slate-400 text-sm">
          <AlertCircle :size="16" />
          <span>On average, users complete this test in 12 minutes</span>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-background flex flex-col items-center justify-center gap-5">

    <Spinner size="xl" :text="countdown.toString()"></Spinner>
    <p class="font-display font-bold text-2xl">Starting in...</p>
  </div>
</template>