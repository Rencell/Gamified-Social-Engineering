<template>
    <div class="flex flex-col items-center px-8 py-12">
        <!-- Active Call Header -->
        <div class="text-center mb-8">
            <p class="text-xs text-emerald-400 font-medium mb-2">Call In Progress</p>
            <p class="text-2xl text-white font-mono font-semibold">{{ formattedTimer }}</p>
        </div>

        <!-- Caller Avatar - Active State -->
        <div class="relative mb-8">
            <div class="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl" />
            <div
                class="h-40 w-40 border-4 border-emerald-500/20 shadow-2xl relative rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 text-white text-5xl font-semibold">
                <img v-if="callerAvatar" :src="callerAvatar" :alt="callerName"
                    class="h-full w-full rounded-full object-cover" />
                <span v-else>{{ callerInitials }}</span>
            </div>
        </div>

        <!-- Caller Info -->
        <div class="text-center mb-7">
            <h2 class="text-2xl font-semibold text-white mb-1 text-balance">{{ callerName }}</h2>
            <p class="text-sm text-slate-400">{{ callerNumber }}</p>
        </div>
        <div v-show="isMuted" class="text-xs mb-3 text-slate-600">Your mic is muted</div>
        <!-- Call Controls -->
        <div class="grid grid-cols-2 gap-6 w-full max-w-xs mb-8">


            <button @click="toggleMute"
                class="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors"
                type="button">
                <div :class="[
                    'h-14 w-14 rounded-full flex items-center justify-center transition-colors',
                    isMuted ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-800 hover:bg-slate-700',
                ]">
                    <MicOff v-if="isMuted" class="h-5 w-5 text-white" />
                    <Mic v-else class="h-5 w-5" />
                </div>
                <span class="text-xs">{{ isMuted ? 'Unmute' : 'Mute' }}</span>
            </button>

            <button class="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors"
                type="button">
                <div
                    class="h-14 w-14 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                    <Pause class="h-5 w-5" />
                </div>
                <span class="text-xs">Hold</span>
            </button>
        </div>
        
        <div class="w-full max-w-xl mt-10">
            <AnswerSide @sent="sendMessage" :is-speaking="isSpeaking" />
        </div>

    </div>
</template>


<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { Mic, MicOff, PhoneOff, Pause }  from 'lucide-vue-next'
import { useGeminiWs } from '@/composables/useGeminiAudio'
import AnswerSide from '@/components/vishing_simulation/answer_side.vue'
import { disconnectSoundFx, playSoundFx, SoundFx } from '@/composables/useSoundFx';


const {
  connect,
  disconnect,
  sendJson,
  isSpeaking,
  isDisconnected,
  callResult,
  vishingNotification
} = useGeminiWs()

const timer = ref(0);
const isMuted = ref(false);
let intervalId: number | null = null;
const CALL_TIMEOUT = 180; // 3 minutes in seconds

defineProps<{
    callerName: string;
    callerNumber: string;
    callerInitials: string;
    callerAvatar?: string;
}>();

const formattedTimer = computed(() => {
    const seconds = timer.value
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const emit = defineEmits(['end-call', 'result', 'send-notification']);

const toggleMute = () => {
    isMuted.value = !isMuted.value;
};

const sendMessage = (message: string) => {
    sendJson({ type: 'text', text: message });
    console.log('Sent message:', message);
};

onMounted(() => {
    disconnectSoundFx();
    playSoundFx(SoundFx.OfficeBackground, true);
    intervalId = window.setInterval(() => {
        timer.value += 1;
    }, 1000);

    connect();
});

onUnmounted(() => {
  if (intervalId != null) window.clearInterval(intervalId);
  disconnectSoundFx();
  disconnect();

});

watch(isDisconnected, (disconnected) => {
  if (disconnected){
    emit('end-call');
    emit('result', callResult.value);
  } 
});

watch(timer, (currentTime) => {
  if (currentTime >= CALL_TIMEOUT ) {
    sendMessage('Goodbye, User ended the call.');
  }
});

watch(vishingNotification, (newValue) => {
    if (newValue) {
        emit('send-notification', true);
    }
});

</script>