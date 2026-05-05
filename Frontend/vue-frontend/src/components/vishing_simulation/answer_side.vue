<template>
  <div class="w-full h-full flex flex-col gap-4 px-6 py-6">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs text-slate-400">Answer Side</p>
        <h3 class="text-lg font-semibold text-white">Your response</h3>
      </div>

      <div class="flex items-center gap-2">
        <span
          class="text-xs px-2 py-1 rounded-full"
          :class="isSupported ? 'bg-slate-800 text-slate-200' : 'bg-amber-500/15 text-amber-300'"
        >
          {{ isSupported ? 'Speech enabled' : 'Not supported' }}
        </span>
        <span
          class="text-xs px-2 py-1 rounded-full"
          :class="isListening ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-300'"
        >
          {{ isListening ? 'Listening…' : 'Idle' }}
        </span>
      </div>
    </div>

    <!-- Transcript -->
    <div class="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div class="flex items-center justify-between gap-4 mb-2">
        <p class="text-sm text-slate-300">Transcript</p>
        <button
          type="button"
          class="text-xs text-slate-400 hover:text-white transition-colors"
          @click="clearTranscript"
        >
          Clear
        </button>
      </div>

      <p v-if="!note" class="text-sm text-slate-500">
        {{ isSupported ? 'Press Start and speak to generate a transcript.' : 'SpeechRecognition is not available in this browser.' }}
      </p>
      <p v-else class="text-sm text-white whitespace-pre-wrap break-words">
        {{ note }}
      </p>

      <p v-if="error" class="text-xs text-red-300 mt-3">Error: {{ error }}</p>
    </div>


  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import useSpeechRecognition from '@/composables/useSpeechRecognition';

const props = defineProps<{
  isSpeaking: boolean;
}>();
const emit = defineEmits<{
  /** Emits the text to be sent by the parent (ongoing_call.vue). */
  (e: 'sent', message: string): void;
}>();

const { isSupported, isListening, toggleListening, stop, note, finalNote, error } = useSpeechRecognition();

// Auto-send config
const AUTO_SEND_SILENCE_MS = 2000;
const MIN_CHARS_TO_SEND = 3;
let autoSendTimer: number | null = null;
const lastAutoSentText = ref('');
let refreshListenTimer: number | null = null;

function clearAutoSendTimer() {
  if (autoSendTimer != null) {
    window.clearTimeout(autoSendTimer);
    autoSendTimer = null;
  }
}

function clearRefreshListenTimer() {
  if (refreshListenTimer != null) {
    window.clearTimeout(refreshListenTimer);
    refreshListenTimer = null;
  }
}

function refreshListening() {
  clearRefreshListenTimer();
  if (!isSupported.value) return;
  if (props.isSpeaking) return;

  // Refresh recognition by toggling, waiting, then toggling again.
  toggleListening();
  window.setTimeout(() => {
    if (props.isSpeaking) return;
    toggleListening();
    scheduleRefreshIfStillEmpty();
  }, 500);
}

function scheduleRefreshIfStillEmpty() {
  clearRefreshListenTimer();
  if (props.isSpeaking) return;
  if (!isListening.value) return;

  refreshListenTimer = window.setTimeout(() => {
    if (props.isSpeaking) return;
    if (note.value.trim()) return;
    refreshListening();
  }, 3000);
}

function clearTranscript() {
  note.value = '';
  finalNote.value = '';
  error.value = null;
  lastAutoSentText.value = '';
  clearAutoSendTimer();
  clearRefreshListenTimer();
}

function emitText(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  note.value = '';
  emit('sent', trimmed);
}

const hasSpokenOnce = ref(false);
watch(
    () => props.isSpeaking,
    (val) => {
      note.value = '';
      finalNote.value = '';
      clearRefreshListenTimer();
      if (val) {
        hasSpokenOnce.value = true;
        isListening.value = false;
        return;
      }

      if (!hasSpokenOnce.value) {
        hasSpokenOnce.value = true;
      }

      isListening.value = true;
      scheduleRefreshIfStillEmpty();
    },
    { immediate: true },
)

watch(
  note,
  (val) => {
    // only auto-send while speech recognition is active
    if (!isListening.value) return;

    const current = (finalNote.value || val || '').trim();
    if (current.length < MIN_CHARS_TO_SEND) return;

    clearRefreshListenTimer();

    clearAutoSendTimer();
    autoSendTimer = window.setTimeout(() => {
      const toSend = (finalNote.value || note.value).trim();
      if (toSend.length < MIN_CHARS_TO_SEND) return;
      if (toSend === lastAutoSentText.value) return;

      lastAutoSentText.value = toSend;
      emitText(toSend);

      // end the user's turn
      stop();
      clearAutoSendTimer();
    }, AUTO_SEND_SILENCE_MS);
  },
  { flush: 'post' },
);

watch(isListening, (val) => {
  if (!val) {
    clearAutoSendTimer();
    clearRefreshListenTimer();
    return;
  }

  if (!props.isSpeaking && !note.value.trim()) {
    scheduleRefreshIfStillEmpty();
  }
});

onBeforeUnmount(() => {
  clearAutoSendTimer();
  clearRefreshListenTimer();
  stop();
});
</script>
