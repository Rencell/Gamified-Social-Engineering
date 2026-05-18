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

      <!-- <p v-if="error" class="text-xs text-red-300 mt-3">Error: {{ error }}</p> -->
    </div>

  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import useSpeechRecognition from '@/composables/useSpeechRecognition';

const props = defineProps<{
  isSpeaking: boolean;
}>();
const emit = defineEmits<{
  /** Emits the text to be sent by the parent (ongoing_call.vue). */
  (e: 'sent', message: string): void;
}>();

const { isSupported, isListening, toggleListening, stop, note, finalNote, error } = useSpeechRecognition("fil-PH");

// Auto-send config
const AUTO_SEND_SILENCE_MS = 1300;
const MIN_CHARS_TO_SEND = 3;
let autoSendTimer: number | null = null;
const lastAutoSentText = ref('');
const SILENCE_TIMEOUT_MS = 5000;
let silenceTimer: number | null = null;

function clearAutoSendTimer() {
  if (autoSendTimer != null) {
    window.clearTimeout(autoSendTimer);
    autoSendTimer = null;
  }
}

function clearSilenceTimer() {
  if (silenceTimer != null) {
    window.clearTimeout(silenceTimer);
    silenceTimer = null;
  }
}

function startSilenceTimer() {
  clearSilenceTimer();
  silenceTimer = window.setTimeout(() => {
    const current = (finalNote.value || note.value || '').trim();
    if (current.length >= MIN_CHARS_TO_SEND) {
      if (current !== lastAutoSentText.value) {
        emitText(current);
      }
    } else {
      emitText('USER_WENT_SILENT');
    }
  }, SILENCE_TIMEOUT_MS);
}


function clearTranscript() {

  emitText('Hello');
}

function emitText(text: string) {
  if (props.isSpeaking) return;

  const trimmed = text.trim();
  if (!trimmed) return;
  note.value = '';
  emit('sent', trimmed);
}

watch(
  note,
  (val) => {
    if (props.isSpeaking) return;

    const current = (finalNote.value || val || '').trim();
    if (current.length < MIN_CHARS_TO_SEND) return;

    clearAutoSendTimer();
    startSilenceTimer();
    autoSendTimer = window.setTimeout(() => {
      const toSend = (finalNote.value || note.value).trim();
      if (toSend.length < MIN_CHARS_TO_SEND) return;
      if (toSend === lastAutoSentText.value) return;

      lastAutoSentText.value = toSend;
      emitText(toSend);

    }, AUTO_SEND_SILENCE_MS);
  },
  { flush: 'post' },
);

watch(() => props.isSpeaking, (val) => {
  if (val) {
    clearAutoSendTimer();
    clearSilenceTimer();
    return;
  }
  // when speaking stops, start the silence timer
  startSilenceTimer();
});

onBeforeUnmount(() => {
  clearAutoSendTimer();
  clearSilenceTimer();
  stop();
});

onMounted(() => {
  toggleListening();
});

</script>
