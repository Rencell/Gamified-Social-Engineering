<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { useProfanityCheck } from '@/composables/useProfanityCheck'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
  defaultValue?: string | number
  modelValue?: string | number
  isProfane?: boolean
  warningText?: string
  validateOnInput?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
  (e: 'update:isProfane', payload: boolean): void
}>()

const attrs = useAttrs()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const isProfaneModel = useVModel(props, 'isProfane', emits, {
  passive: true,
  defaultValue: false,
})

const { checkProfanity } = useProfanityCheck()

const inputClass = computed(() =>
  cn(
    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    props.class,
    isProfaneModel.value ? 'border-destructive focus-visible:border-destructive' : null,
  ),
)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const nextValue = target.value

  modelValue.value = nextValue

  if (props.validateOnInput !== false) {
    isProfaneModel.value = checkProfanity(nextValue)
  }
}
</script>

<template>
  <div class="space-y-2 w-full">
    <input
      v-bind="attrs"
      :value="modelValue"
      data-slot="input"
      :class="inputClass"
      @input="handleInput"
      @blur="isProfaneModel = checkProfanity(String(modelValue ?? ''))"
    >
    <p v-if="isProfaneModel" class="text-sm text-destructive">
      {{ warningText || 'Please remove inappropriate language before saving.' }}
    </p>
  </div>
</template>