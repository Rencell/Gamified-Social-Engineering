import { h } from 'vue'
import { toast } from 'vue-sonner'
import ToastCall from './toastCall.vue'

export function showIncomingCallToast(opts: {
  callerName?: string
  callerNumber?: string
  onAccept: () => void
  onDecline?: () => void
}) {
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
    },
  )
}

export function dismissIncomingCallToast() {
  toast.dismiss('incoming-call')
}
