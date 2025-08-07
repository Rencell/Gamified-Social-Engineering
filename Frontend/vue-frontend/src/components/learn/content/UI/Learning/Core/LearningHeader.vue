<template>
    <div :class="['text-3xl font-bold mb-3 animate-in fade-in', customClass]">
        <slot></slot>
    </div>
</template>

<script setup>
defineProps({
  customClass: {
    type: [String, Array, Object],
    default: ''
  }
})
</script>