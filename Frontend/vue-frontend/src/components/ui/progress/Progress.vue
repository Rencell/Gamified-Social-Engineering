<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  ProgressIndicator,
  ProgressRoot,
  type ProgressRootProps,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<ProgressRootProps & { class?: HTMLAttributes['class'], bg?: string, bgBackground?: string }>(),
  {
    modelValue: 0,
    bg: 'bg-accent',
    bgBackground: 'bg-secondary',
  },
)

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <ProgressRoot data-slot="progress" v-bind="delegatedProps" :class="cn(
    'relative h-5 w-auto flex-1 min-w-0 overflow-hidden rounded-full',
    props.class,
    props.bgBackground
  )
    ">
    <ProgressIndicator data-slot="progress-indicator"
      class="h-full w-full flex-1 transition-all rounded-full relative"
      :class="[bg]"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`">
      <div class="brightness-120 absolute rounded-full top-1 h-1 right-2  inset-0 ms-auto"
      :class="[bg]"
        :style="{ width: `calc(${(props.modelValue ?? 0)}% - 1rem)` }"></div>
    </ProgressIndicator>
  </ProgressRoot>
</template>
