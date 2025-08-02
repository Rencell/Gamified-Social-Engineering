<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
// @ts-ignore
import Typewriter from 'typewriter-effect/dist/core';
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['animationEnd']);

const typewriterRef = ref<HTMLDivElement | null>(null);

const initializeTypewriter = (element: HTMLDivElement | null, text: string) => {
  if (!element) return;

  const typewriter = new Typewriter(element, {
    delay: 10,
    loop: false,
  });

  typewriter
    .typeString(text)
    .callFunction(() => {
      emit('animationEnd');
    })
    .start();
};

onMounted(() => {
  initializeTypewriter(typewriterRef.value, props.text);
});

watch(() => props.text, (newText) => {
    if (typewriterRef.value) {
        typewriterRef.value.innerHTML = '';
    }
    initializeTypewriter(typewriterRef.value, newText);
});

</script>

<template>
  <div ref="typewriterRef"></div>
</template>
