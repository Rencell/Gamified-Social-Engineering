<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-secondary text-card-foreground flex flex-col gap-6 rounded-xl py-6 backdrop-blur shadow-md border-ternary',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
