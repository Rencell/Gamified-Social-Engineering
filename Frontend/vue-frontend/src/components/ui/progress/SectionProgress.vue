<script setup lang="ts">
import { ProgressIndicator, ProgressRoot, type ProgressRootProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<ProgressRootProps & { class?: string }>(),
  {
    modelValue: 0,
  },
)
</script>

<template>
  <ProgressRoot
    :value="props.modelValue"
    :class="cn(
      'relative h-1.5 w-full overflow-hidden rounded-full bg-secondary',
      props.class,
    )"
  >
    <ProgressIndicator
      :style="{ transform: `translateX(-${100 - (props.modelValue ?? 0)}%)` }"
      class="h-full w-full flex-1 bg-accent transition-transform"
    />
  </ProgressRoot>
  <p class="text-xs font-bold">{{ props.modelValue }}%</p>
</template>
