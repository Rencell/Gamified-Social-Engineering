import { computed, onBeforeUnmount, ref, watch } from 'vue'

type WsStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

type TextEvent = { type: 'text'; text: string }
type ErrorEvent = { type: 'error'; message: string }
type SummaryEvent = { type: 'summary'; text: string }
type NotificationEvent = { type: 'notification'; text: string }

function isTextEvent(e: unknown): e is TextEvent {
  if (!e || typeof e !== 'object') return false
  const obj = e as Record<string, unknown>
  return obj.type === 'text' && typeof obj.text === 'string'
}

function isErrorEvent(e: unknown): e is ErrorEvent {
  if (!e || typeof e !== 'object') return false
  const obj = e as Record<string, unknown>
  return obj.type === 'error' && typeof obj.message === 'string'
}

function isSummaryEvent(e: unknown): e is SummaryEvent {
  if (!e || typeof e !== 'object') return false
  const obj = e as Record<string, unknown>
  return obj.type === 'summary' && typeof obj.text === 'string'
}

function isNotificationEvent(e: unknown): e is NotificationEvent {
  if (!e || typeof e !== 'object') return false
  const obj = e as Record<string, unknown>
  return obj.type === 'notification' && typeof obj.text === 'string'
}

function pcm16ToFloat32(pcm: Int16Array): Float32Array {
  const out = new Float32Array(pcm.length)
  for (let i = 0; i < pcm.length; i++) out[i] = pcm[i] / 32768
  return out
}

function getURL() {
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws"
  return `${wsProtocol}://${window.location.host}/ws/gemini/audio/`
}

export function useGeminiWs() { 
  const ws = ref<WebSocket | null>(null)
  const status = ref<WsStatus>('idle')
  const lastError = ref<string | null>(null)
  const endRequested = ref(false)
  const messages = ref<Array<{ ts: number; kind: 'in' | 'out'; data: string }>>([])
  const callResult = ref<string[] | null>([])
  const vishingNotification = ref<boolean>(false)

  // Parsed assistant text messages (from {type:"text"})
  const assistantTexts = ref<Array<{ ts: number; text: string }>>([])

  // Audio playback (Gemini native audio is typically 24kHz PCM16 mono)
  const playCtx = ref<AudioContext | null>(null)
  const outputSampleRate = ref<number>(24000)
  let playCursorTime = 0

  // Track "speaking" using the AudioContext clock (more accurate than Date.now()).
  // This represents the end time (in seconds) of the currently scheduled audio.
  const estimatedSpeechEndTimeSec = ref<number>(0)

  // Reactive ticker so s`isSpeaking` updates as time passes.
  const audioNowSec = ref<number>(0)
  let audioNowRafId: number | null = null
  const startAudioNowTicker = () => {
    if (audioNowRafId != null) return
    const tick = () => {
      const ctx = playCtx.value
      audioNowSec.value = ctx ? ctx.currentTime : 0
      audioNowRafId = requestAnimationFrame(tick)
    }
    audioNowRafId = requestAnimationFrame(tick)
  }
  const stopAudioNowTicker = () => {
    if (audioNowRafId != null) {
      cancelAnimationFrame(audioNowRafId)
      audioNowRafId = null
    }
  }

  const isSpeaking = computed(() => {
    // make this computed depend on time passing
    void audioNowSec.value

    const ctx = playCtx.value
    if (!ctx) return false

    // Small hysteresis so UI doesn't flicker between chunks.
    const bufferSec = 0.1
    return estimatedSpeechEndTimeSec.value > ctx.currentTime - bufferSec
  })

  // Clear timer in case onended doesn't fire (e.g., context suspended / rapid rescheduling).
  let clearSpeakingTimerId: number | null = null
  const scheduleClearSpeaking = (ctx: AudioContext, chunkEndSec: number) => {
    if (clearSpeakingTimerId != null) {
      clearTimeout(clearSpeakingTimerId)
      clearSpeakingTimerId = null
    }

    const msUntilEnd = Math.max(0, (chunkEndSec - ctx.currentTime) * 1000)
    clearSpeakingTimerId = window.setTimeout(() => {
      // Only clear if nothing else extended the schedule.
      if (estimatedSpeechEndTimeSec.value <= chunkEndSec + 0.001) {
        estimatedSpeechEndTimeSec.value = ctx.currentTime
      }
      clearSpeakingTimerId = null
    }, msUntilEnd + 120) // + buffer for scheduling jitter
  }

  async function ensureAudioContext(sampleRate: number) {
    if (!playCtx.value || playCtx.value.sampleRate !== sampleRate) {
      if (playCtx.value) {
        try {
          await playCtx.value.close()
        } catch {
          // ignore
        }
      }
      playCtx.value = new AudioContext({ sampleRate })
      playCursorTime = playCtx.value.currentTime
    }

    if (playCtx.value.state === 'suspended') {
      await playCtx.value.resume()
    }

    // Ensure UI updates as audio plays.
    startAudioNowTicker()
  }

  async function playPcm16Mono(pcmBytes: ArrayBuffer, sampleRate: number) {
    await ensureAudioContext(sampleRate)
    const ctx = playCtx.value!

    const pcm16 = new Int16Array(pcmBytes)
    const floats = pcm16ToFloat32(pcm16)

    const buffer = ctx.createBuffer(1, floats.length, sampleRate)
    buffer.copyToChannel(floats, 0)

    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.connect(ctx.destination)

    const now = ctx.currentTime
    // Keep a small lead so chunks stitch together without gaps.
    const leadSec = 0.03
    if (playCursorTime < now + leadSec) playCursorTime = now + leadSec

    src.start(playCursorTime)

    const chunkStart = playCursorTime
    const chunkEnd = chunkStart + buffer.duration
    playCursorTime = chunkEnd

    // Update speech end estimate in the same timebase as playback.
    estimatedSpeechEndTimeSec.value = Math.max(estimatedSpeechEndTimeSec.value, chunkEnd)

    // Ensure it eventually flips back even if `onended` isn't called.
    scheduleClearSpeaking(ctx, estimatedSpeechEndTimeSec.value)

    // When playback finishes (and no later chunks extended the end), clear the estimate.
    src.onended = () => {
      if (Math.abs(estimatedSpeechEndTimeSec.value - chunkEnd) < 0.001) {
        estimatedSpeechEndTimeSec.value = ctx.currentTime
      }
    }
  }

  const isOpen = computed(() => status.value === 'open')
  const isDisconnected = computed(() => status.value === 'closed' || status.value === 'error')

  watch(
    [endRequested, isSpeaking],
    ([endNow, speaking]) => {
      if (!endNow) return
      if (speaking) return
      setInterval(() => {
        disconnect()
      }, 1000);
    },
    { flush: 'post' },
  )


  const connect = (url = getURL()) => {
    if (ws.value && (ws.value.readyState === WebSocket.OPEN || ws.value.readyState === WebSocket.CONNECTING)) return

    status.value = 'connecting'
    lastError.value = null

      const sock = new WebSocket(url)
      // Prefer ArrayBuffer for binary audio frames (easier to handle later)
    sock.binaryType = 'arraybuffer'
    ws.value = sock

    sock.onopen = () => {
      status.value = 'open'
      sendJson({type: 'text', text: 'start now'})
    }

    sock.onerror = () => {
      status.value = 'error'
      lastError.value = 'WebSocket error (see devtools Network > WS for details)'
    }

    sock.onclose = () => {
      status.value = 'closed'
    }

    sock.onmessage = async (evt) => {
        
      // Text frames from backend are JSON strings
      
      if (typeof evt.data === 'string') {
        const raw = evt.data
        messages.value.push({ ts: Date.now(), kind: 'in', data: raw })

        // Best-effort parse for {type:"text", text:"..."}
        try {
          const parsedUnknown: unknown = JSON.parse(raw)
          

          if(isSummaryEvent(parsedUnknown)) {
            callResult.value?.push(parsedUnknown.text)
            return
          }

          if(isNotificationEvent(parsedUnknown)) {
            console.log("Notification event received:", parsedUnknown)
            vishingNotification.value = true
            return
          }

          if (isTextEvent(parsedUnknown)) {
            if (parsedUnknown.text === 'end') {
              endRequested.value = true
              return
            }
            assistantTexts.value.push({ ts: Date.now(), text: parsedUnknown.text })
          } else if (isErrorEvent(parsedUnknown)) {
            lastError.value = parsedUnknown.message
          }
        } catch {
          // ignore non-JSON text frames
        }

        return
      }

      // Binary frames (audio) will arrive as ArrayBuffer because binaryType='arraybuffer'
      if (evt.data instanceof ArrayBuffer) {
        messages.value.push({ ts: Date.now(), kind: 'in', data: `[binary ${evt.data.byteLength} bytes]` })
        // Play as PCM16 mono
        await playPcm16Mono(evt.data, outputSampleRate.value)
        return
      }

    
      
      // Fallback
      messages.value.push({ ts: Date.now(), kind: 'in', data: `[binary]` })
    }
  }

  const disconnect = () => {
    ws.value?.close()
    ws.value = null
    estimatedSpeechEndTimeSec.value = 0
    if (clearSpeakingTimerId != null) {
      clearTimeout(clearSpeakingTimerId)
      clearSpeakingTimerId = null
    }
    stopAudioNowTicker()
  }

  const sendJson = (obj: unknown) => {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return
    const payload = JSON.stringify(obj)
    messages.value.push({ ts: Date.now(), kind: 'out', data: payload })
    ws.value.send(payload)
  }

  const assistantTextCombined = computed(() => assistantTexts.value.map((m) => m.text).join(''))

  onBeforeUnmount(async () => {
    disconnect()
    if (playCtx.value) {
      try {
        await playCtx.value.close()
      } catch {
        // ignore
      }
      playCtx.value = null
    }
  })

  return {
    status,
    lastError,
    messages,
    assistantTexts,
    assistantTextCombined,
    isOpen,
    isDisconnected,
    isSpeaking,
    connect,
    disconnect,
    sendJson,
    outputSampleRate,
    callResult,
    vishingNotification
  }
}