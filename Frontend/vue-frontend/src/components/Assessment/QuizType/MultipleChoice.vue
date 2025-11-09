<template>
    <div v-if="question" class="space-y-8 flex flex-col items-center w-3xl">
      <h2 class="w-full text-xl font-display font-bold text-white text-center text-pretty">
        {{ question.text }}
      </h2>
  
      <div class="grid gap-6 w-full" :class="hasImage ? 'grid-cols-2' : ''">
        <div
          v-if="hasImage"
          class="p-3 bg-black rounded-lg flex items-center justify-center"
        >
          <img class="object-contain max-h-96 w-full" :src="question.image" alt="">
        </div>
  
        <div class="grid gap-4 md:gap-6 w-full " :class="{'px-20': !hasImage}">
          <div
            v-for="(item, key) in question.options"
            :key="key"
            class="group relative"
          >
            <div
              class="p-4 md:p-5 rounded-lg border-2 border-ternary hover:border-slate-600
                     bg-secondary hover:bg-slate-900 transition-all duration-200 cursor-pointer
                     w-full"
            >
              <div class="flex gap-4 md:gap-6 items-center">
                <span
                  class="flex h-8 w-8 md:h-5 md:w-5 items-center justify-center rounded-full
                         border border-slate-600 text-xs font-semibold text-slate-300"
                >
                  {{ key + 1 }}
                </span>
                <p class="text-primary text-base font-bold font-display text-left flex-1">
                  {{ item.text }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="h-20"></div>
    </div>
  </template>
  

<script setup lang="ts">
import type { Question } from '@/services/assessmentService';
import { computed } from 'vue';

const props = defineProps<{
  questions: Question;
}>();

const question = computed(() => {
    return props.questions;
});

const hasImage = computed(() => {
    return question.value.image;
});

</script>

<style scoped>
/* Add any additional styles here if needed */
</style>