<template>
    <div v-show="vishingNotification">

        <Index :scenario="1" @result="handleResult($event)" />
    </div>
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div
            class="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl border border-slate-800">
            <!-- Close Button -->
            <Button variant="ghost" size="icon"
                class="absolute top-4 right-4 z-10 text-slate-400 hover:text-white hover:bg-slate-800/50"
                @click="handleDecline">
                <X class="h-5 w-5" />
            </Button>

            <!-- Call Content -->
            <div v-if="isTransitioning" class="flex flex-col items-center justify-center px-8 py-12 min-h-[600px]">
                <div class="relative mb-8">
                    <div class="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
                    <div class="h-40 w-40 border-4 border-emerald-500/30 shadow-2xl relative animate-pulse rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 text-white text-5xl font-semibold">
                        <img v-if="callerAvatar" :src="callerAvatar" :alt="callerName" class="h-full w-full rounded-full object-cover" />
                        <span v-else>{{ callerInitials }}</span>
                    </div>
                </div>
                <div class="text-center">
                    <p class="text-emerald-400 text-lg font-medium mb-2 animate-pulse">Connecting...</p>
                    <div class="flex items-center gap-2 justify-center">
                        <div class="h-2 w-2 rounded-full bg-emerald-500 animate-bounce"
                            :style="{ animationDelay: '0ms' }" />
                        <div class="h-2 w-2 rounded-full bg-emerald-500 animate-bounce"
                            :style="{ animationDelay: '150ms' }" />
                        <div class="h-2 w-2 rounded-full bg-emerald-500 animate-bounce"
                            :style="{ animationDelay: '300ms' }" />
                    </div>
                </div>
            </div>

            <div v-else-if="callState === 'incoming'" class="flex flex-col items-center px-8 py-12">
                <!-- Status -->
                <div class="text-center mb-8">
                    <p class="text-sm text-slate-400 font-medium">Incoming Call</p>
                </div>

                <!-- Caller Avatar -->
                <div class="relative mb-6">
                    <div class="absolute inset-0 animate-ping rounded-full bg-emerald-500/30 scale-110" />
                    <div class="h-32 w-32 border-4 border-slate-800 shadow-xl relative rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 text-white text-4xl font-semibold">
                        <img v-if="callerAvatar" :src="callerAvatar" :alt="callerName" class="h-full w-full rounded-full object-cover" />
                        <span v-else>{{ callerInitials }}</span>
                    </div>
                </div>

                <!-- Caller Info -->
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-semibold text-white mb-2 text-balance">{{ callerName }}</h2>
                    <p class="text-sm text-slate-400 font-mono">{{ callerNumber }}</p>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-center gap-20 w-full">
                
                    <button @click="handleAccept" class="group relative flex flex-col items-center gap-3">
                        <div class="relative">
                            <div
                                class="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/30 transition-all" />
                            <div
                                class="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-lg">
                                <Phone class="h-7 w-7 text-white" />
                            </div>
                        </div>
                        <span class="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
                            Accept
                        </span>
                    </button>
                </div>

                <!-- Quick Actions -->
                <div class="flex items-center gap-6 mt-8">
                    <button class="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
                        type="button">
                        <div
                            class="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M3 11l18-5v12L3 14v-3z" />
                                <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                            </svg>
                        </div>
                        <span class="text-xs">Remind</span>
                    </button>
                    <button class="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
                        type="button">
                        <div
                            class="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <span class="text-xs">Message</span>
                    </button>
                </div>
            </div>

            <div v-else >
                <Ongoing_call 
                    @end-call="handleEndCall" 
                    @send-notification="handleNotification($event)"
                    @result="handleResult($event)"
                    :caller-number="callerNumber" 
                    :caller-name="callerName" 
                    :caller-initials="callerInitials" 
                    :caller-avatar="callerAvatar"/>
                </div>
            </div>
        </div>
        
        
    <div v-if="isResult">
        <Call_result :call-result="callResult" @close="handleResultClose" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Phone, X } from 'lucide-vue-next'

import Button from '@/components/ui/button/Button.vue'
import Ongoing_call from './ongoing_call.vue'
import Call_result from './dialog/call_result.vue'
import { disconnectSoundFx, playSoundFx, SoundFx } from '@/composables/useSoundFx'
import Index from '../PopupTypes/vishing/index.vue'

type CallState = 'incoming' | 'active'

interface Props {
    callerName?: string
    callerNumber?: string
    callerAvatar?: string
}

const neutralCallerNames = [
    'Alex Kyle',
    'UNKNOWN',
]

const callerNumbers = [
    '+1 (555) 204-7712',
    '+1 (555) 318-6409',
    '+1 (555) 472-1538',
    '+1 (555) 589-2264',
    '+1 (555) 697-8841',
    '+1 (555) 745-3097',
]

function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)]
}

const randomCallerName = pickRandom(neutralCallerNames)
const randomCallerNumber = pickRandom(callerNumbers)

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'accept'): void
    (e: 'decline'): void
    (e: 'close'): void
}>()

const isVisible = ref(true)
const callState = ref<CallState>('incoming')
const isTransitioning = ref(false)
const isResult = ref<boolean>(false)
const callResult = ref<string[]>([])
const vishingNotification = ref<boolean>(false)

const callerName = computed(() => props.callerName ?? randomCallerName)
const callerNumber = computed(() => props.callerNumber ?? randomCallerNumber)
const callerAvatar = computed(() => props.callerAvatar ?? '')

const callerInitials = computed(() =>
    callerName.value
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join(''),
)

async function handleAccept() {
    
    isTransitioning.value = true
    window.setTimeout(() => {
        callState.value = 'active'
        isTransitioning.value = false
    }, 600)

    emit('accept')
}


const handleDecline = () => showVisibleAndResult(false, false)
const handleClose = () => showVisibleAndResult(false, true)
const handleEndCall = () => showVisibleAndResult(false, true)
const handleResultClose = () => showVisibleAndResult(false, false)

function showVisibleAndResult(visible: boolean, result: boolean) {
    isVisible.value = visible
    isResult.value = result
    disconnectSoundFx();
}

function handleResult(result: string[]) {
    callResult.value = result
    handleEndCall();
    handleNotification(false);
}

function handleNotification(result: boolean){
    vishingNotification.value = result
    // handleEndCall();
}

onMounted(() => {
     playSoundFx(SoundFx.Calling, true)
})
</script>
