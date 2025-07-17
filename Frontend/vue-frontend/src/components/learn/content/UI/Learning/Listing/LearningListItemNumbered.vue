<template>
  <li class="flex items-center justify-between mb-4 last:mb-0">
    <div class="flex items-start">
      <span class="flex-shrink-0 w-6 h-6 rounded-full bg-[#299F69] text-white flex items-center justify-center text-xs font-bold mt-1.5 mr-6">{{ number }}</span>
      <div class="text-gray-200 text-sm/loose font-medium">
        <slot></slot>
      </div>
    </div>
    <img v-if="image" :src="image" alt="list item image" class="w-12 h-12 object-cover rounded-md ml-6" />
  </li>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';


defineProps({
  image: {
    type: String,
    default: null,
  },
  number: {
    type: Number,
    required: true,
  }
});
</script>
