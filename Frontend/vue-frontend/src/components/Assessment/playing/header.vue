<script setup lang="ts">
import { Clock, X } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import Progress from '@/components/ui/progress/Progress.vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useAssessmentStore } from '@/stores/assessment';

const router = useRouter();
const goBack = () => { router.back(); };

const assessmentStore = useAssessmentStore();
const currentSession = computed(() => assessmentStore.currentSession);
const duration = computed(() => currentSession.value?.assessment?.duration ?? 0);
const remainingTime = ref(duration.value + ":00");
let interval: any = null;

const countdown = () => {
  // Clear any existing interval first
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  if (!currentSession.value?.started_at) {
    console.log('No started_at found, session:', currentSession.value);
    return;
  }

  console.log('Starting countdown with started_at:', currentSession.value.started_at);
  
  const start = new Date(currentSession.value.started_at);
  const end = new Date(start.getTime() + duration.value  * 60 * 1000);

  // Update immediately first
  const updateTime = () => {
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    console.log('Time diff:', diff, 'ms');

    if (diff <= 0) {
      remainingTime.value = "00:00";
      if (currentSession.value) {
        assessmentStore.timeout_assessment(currentSession.value.session_id);
        currentSession.value.status = 'timeout';
      }
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      console.log('Time is up!');
      return;
    }

    const mins = Math.floor(diff / 1000 / 60);
    const secs = Math.floor((diff / 1000) % 60);

    remainingTime.value = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Update immediately
  updateTime();

  // Then update every second
  interval = setInterval(updateTime, 1000);
};

// Watch for currentSession changes
watch(
  () => currentSession.value?.started_at,
  (newStartedAt) => {
    console.log('Session started_at changed:', newStartedAt);
    if (newStartedAt) {
      countdown();
    }
  },
  { immediate: true }
);

onMounted(() => {
  console.log('Component mounted, currentSession:', currentSession.value);
  // The watcher will handle starting the countdown
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
});

defineProps<{ progress?: number; }>();
</script>

<template>
    <header>
      
        <div class="flex justify-center gap-5 px-8 py-8 bg-background">
            <div class="w-4xl flex justify-between gap-5">
              <button @click="goBack" class="text-slate-400 hover:text-slate-300 transition">
                  <X :size="24" />
              </button>
  
              <Progress :model-value="progress" />
              <div class="flex gap-3">
                  <div class="flex items-center text-ternary gap-2">
                      <Clock />
                      <span class="ml-1 font-bold">{{ remainingTime }}</span>
                  </div>
              </div>
            </div>
        </div>
        
    </header>
</template>