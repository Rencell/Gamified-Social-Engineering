<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  customClass?: string | string[] | Record<string, boolean>
}

const props = defineProps<Props>()
</script>
<template>
  <div :class="['text-3xl font-bold mb-3 animate-in fade-in', customClass]">
    <slot></slot>
  </div>
</template>
