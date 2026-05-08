import { h } from 'vue'
import { toast } from 'vue-sonner'
import ToastCall from './toastCall.vue'
import { disconnectSoundFx, playSoundFx, SoundFx } from '@/composables/useSoundFx'

export function showIncomingCallToast(opts: {
  callerName?: string
  callerNumber?: string
  onAccept: () => void
  onDecline?: () => void
}) {
  playSoundFx(SoundFx.Calling, true)
  toast.custom(
    () =>
      h(ToastCall, {
        callerName: opts.callerName,
        callerNumber: opts.callerNumber,
        onAccept: opts.onAccept,
        onDecline: opts.onDecline,
      }),
    {
      id: 'incoming-call',
      duration: Infinity,
      position: 'top-right',
      dismissible: false,
    },
  )
}

export function dismissIncomingCallToast() {
  toast.dismiss('incoming-call')
  disconnectSoundFx();
}

