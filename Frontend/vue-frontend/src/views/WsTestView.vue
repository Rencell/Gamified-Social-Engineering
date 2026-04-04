<!-- filepath: d:\Programming\Capstone v2\Frontend\vue-frontend\src\views\WsTestView.vue -->
<template>
  <Incoming_call v-if="showIncoming" @close="showIncoming = false" @decline="showIncoming = false" />
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Gemini WS Chat (Text + optional Audio)</h1>

    <div class="flex gap-2 items-center flex-wrap">
      <button class="px-3 py-2 border rounded" @click="triggerIncomingToast">Trigger Incoming Call Toast</button>
      <button class="px-3 py-2 border rounded" @click="connect()">Connect</button>
      <button class="px-3 py-2 border rounded" @click="disconnect()">Disconnect</button>

      <span class="text-sm">Status: <b>{{ status }}</b></span>
      <span v-if="lastError" class="text-sm text-red-500">{{ lastError }}</span>

      <label class="text-sm flex items-center gap-2">
        Output sample rate
        <select v-model.number="outputSampleRate" class="border rounded px-2 py-1">
          <option :value="24000">24000</option>
          <option :value="22050">22050</option>
          <option :value="16000">16000</option>
          <option :value="48000">48000</option>
        </select>
      </label>
    </div>

    <div class="space-y-2">
      <div class="text-sm font-semibold">Chat</div>
      <div class="border rounded p-3 bg-ternary/60 max-h-[340px] overflow-auto space-y-2">
        <div v-for="(m, idx) in chatMessages" :key="idx" class="text-sm">
          <div class="font-semibold" :class="m.role === 'user' ? 'text-blue-700' : 'text-green-700'">
            {{ m.role === 'user' ? 'You' : 'Gemini' }}
          </div>
          <div class="whitespace-pre-wrap">{{ m.text }}</div>
        </div>
        <div v-if="chatMessages.length === 0" class="text-sm text-gray-500">No messages yet.</div>
      </div>

      <div class="flex gap-2">
        <input
          v-model="draft"
          class="flex-1 border rounded px-3 py-2"
          type="text"
          :disabled="!isOpen"
          placeholder="Type a message..."
          @keydown.enter.prevent="sendDraft"
        />
        <button class="px-3 py-2 border rounded" :disabled="!isOpen || !draft.trim()" @click="sendDraft">
          Send
        </button>
      </div>

      <div class="flex gap-2 items-center">
        <button class="px-3 py-2 border rounded" :disabled="!isOpen" @click="sendPing">Ping</button>
        <button class="px-3 py-2 border rounded" :disabled="!isOpen" @click="clearChat">Clear chat</button>
      </div>
    </div>

    <details class="border rounded p-3 bg-black/5">
      <summary class="cursor-pointer text-sm font-semibold">Raw WS messages</summary>
      <pre class="mt-2 max-h-[320px] overflow-auto">{{ pretty }}</pre>
    </details>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGeminiWs } from '@/composables/useGeminiAudio'
import Incoming_call from '@/components/vishing_simulation/incoming_call.vue'
import { showIncomingCallToast } from '@/components/vishing_simulation/UI/toastCall'
import ToastCall from '@/components/vishing_simulation/UI/toastCall.vue'

defineOptions({ name: 'WsTestView' })

const showIncoming = ref(false)

function triggerIncomingToast() {
  showIncomingCallToast({
    callerName: 'Sarah Johnson',
    callerNumber: '+1 (555) 123-4567',
    onAccept: () => {
      showIncoming.value = true
    },
    onDecline: () => {
      showIncoming.value = false
    },
  })
}

const {
  status,
  lastError,
  messages,
  assistantTexts,
  isOpen,
  connect,
  disconnect,
  sendJson,
  outputSampleRate,
} = useGeminiWs()

const draft = ref('')
const userMessages = ref<Array<{ ts: number; text: string }>>([])

const chatMessages = computed(() => {
  const all = [
    ...userMessages.value.map((m) => ({ role: 'user' as const, ts: m.ts, text: m.text })),
    ...assistantTexts.value.map((m) => ({ role: 'assistant' as const, ts: m.ts, text: m.text })),
  ]
  return all.sort((a, b) => a.ts - b.ts)
})

const sendPing = () => sendJson({ type: 'ping' })

const sendDraft = () => {
  const text = draft.value.trim()
  if (!text || !isOpen.value) return

  userMessages.value.push({ ts: Date.now(), text })
  sendJson({ type: 'text', text })
  draft.value = ''
}

const clearChat = () => {
  userMessages.value = []
}

const pretty = computed(() =>
  messages.value
    .map((m) => `${new Date(m.ts).toLocaleTimeString()} [${m.kind}] ${m.data}`)
    .join('\n'),
)
</script>