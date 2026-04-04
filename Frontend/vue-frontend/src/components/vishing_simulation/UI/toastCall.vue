<script setup lang="ts">
import { Phone, PhoneOff, UserRound } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

type ToastCallOptions = {
  callerName?: string
  callerNumber?: string
  onAccept: () => void
  onDecline?: () => void
}

const props = withDefaults(defineProps<ToastCallOptions>(), {
  callerName: 'Unknown',
  callerNumber: 'mobile',
})

function accept() {
  toast.dismiss('incoming-call')
  props.onAccept()
}

function decline() {
  toast.dismiss('incoming-call')
  props.onDecline?.()
}
</script>

<template>
  <div class="flex w-full items-center justify-between gap-4 rounded-2xl bg-slate-950/90 px-4 py-3 ring-1 ring-slate-800 shadow-xl ">
    <div class="flex items-center gap-3 min-w-0">
      <div
        class="grid h-12 w-12 place-items-center rounded-full bg-slate-800 text-slate-200 ring-1 ring-slate-700"
      >
        <UserRound class="h-6 w-6" />
      </div>
      <div class="min-w-0">
        <div class="truncate text-base font-semibold text-white">{{ props.callerName }}</div>
        <div class="truncate text-sm text-slate-400">{{ props.callerNumber }}</div>
      </div>
    </div>

    <div class="flex items-center gap-3 shrink-0">
      <button
        type="button"
        @click="decline"
        class="grid h-12 w-12 place-items-center rounded-full bg-red-500 hover:bg-red-600 text-white shadow"
        aria-label="Decline"
      >
        <PhoneOff class="h-5 w-5" />
      </button>

      <button
        type="button"
        @click="accept"
        class="grid h-12 w-12 place-items-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow"
        aria-label="Accept"
      >
        <Phone class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>
