<script setup lang="ts">
import { computed, useAttrs } from "vue"
import type { HTMLAttributes } from "vue"
import { useVModel } from "@vueuse/core"
import { cn } from "@/lib/utils"
import { useProfanityCheck } from "@/composables/useProfanityCheck"

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes["class"]
  defaultValue?: string | number
  modelValue?: string | number
  isProfane?: boolean
  warningText?: string
  validateOnInput?: boolean
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void
  (e: "update:isProfane", payload: boolean): void
}>()

const attrs = useAttrs()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const isProfaneModel = useVModel(props, "isProfane", emits, {
  passive: true,
  defaultValue: false,
})

const { checkProfanity } = useProfanityCheck()

const textareaClass = computed(() =>
  cn(
    "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    props.class,
    isProfaneModel.value ? "border-destructive focus-visible:border-destructive" : null,
  ),
)

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const nextValue = target.value

  modelValue.value = nextValue

  if (props.validateOnInput !== false) {
    isProfaneModel.value = checkProfanity(nextValue)
  }
}
</script>

<template>
  <div class="space-y-2">
    <textarea
      v-bind="attrs"
      :value="modelValue"
      data-slot="textarea"
      :class="textareaClass"
      @input="handleInput"
      @blur="isProfaneModel = checkProfanity(String(modelValue ?? ''))"
    />
    <p v-if="isProfaneModel" class="text-sm text-destructive">
      {{ warningText || 'Please remove inappropriate language before saving.' }}
    </p>
  </div>
</template>