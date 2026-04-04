<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    text: {
        type: [String, null] as unknown as () => string | null,
        default: '',
    }
});

const formattedText = computed(() => {
  const safeText = props.text ?? ''  // convert null/undefined to ''
  return safeText.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-amber-700 dark:text-amber-300">$1</span>');
});

</script>

<template>
    <span v-html="formattedText"></span>

</template>
