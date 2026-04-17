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

    <!-- Controls -->
    <div class="grid grid-cols-2 gap-3">
      <button
        type="button"
        class="h-11 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
        :disabled="!isSupported"
        :class="[
          !isSupported
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : (isListening ? 'bg-emerald-700 text-white hover:bg-emerald-600' : 'bg-emerald-600 text-white hover:bg-emerald-500'),
        ]"
        @click="toggleListening"
      >
        <span class="text-sm">{{ isListening ? 'Stop listening' : 'Start listening' }}</span>
      </button>

      <button
        type="button"
        class="h-11 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
        
        :class="[
          !note
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-slate-700 text-white hover:bg-slate-600',
        ]"
        @click="sendTranscript"
      >
        <span class="text-sm">Send</span>
      </button>
      <button
        type="button"
        class="h-11 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
        
        :class="[
          !note
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-slate-700 text-white hover:bg-slate-600',
        ]"
        @click="emitText('goodbye')"
      >
        <span class="text-sm">goodbye</span>
      </button>
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

function clearAutoSendTimer() {
  if (autoSendTimer != null) {
    window.clearTimeout(autoSendTimer);
    autoSendTimer = null;
  }
}

function clearTranscript() {
  note.value = '';
  finalNote.value = '';
  error.value = null;
  lastAutoSentText.value = '';
  clearAutoSendTimer();
}

function emitText(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  note.value = '';
  emit('sent', trimmed);
}

function sendTranscript() {
  const text = "my first name is janice and my last name is toby"
  // const text = "No sorry i can't give you that and please dont repeatedly ask me, because i will not give even you insist, just goodbye"
  // const text = (finalNote.value || note.value).trim();
  // if (!text) return;
  emitText(text);
}

const hasSpokenOnce = ref(false);
watch(
    () => props.isSpeaking,
    (val) => {
      if (!val && hasSpokenOnce.value) {
        isListening.value = true;
      } else {
        hasSpokenOnce.value = true;
        isListening.value = false;
      }
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
  if (!val) clearAutoSendTimer();
});

onBeforeUnmount(() => {
  clearAutoSendTimer();
  stop();
});
</script>
