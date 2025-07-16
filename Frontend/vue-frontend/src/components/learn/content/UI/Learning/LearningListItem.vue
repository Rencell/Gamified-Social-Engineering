<template>
  <li class="flex items-center justify-between mb-4 last:mb-0">
    <div class="flex items-start">
      <span class="flex-shrink-0 inline-block w-3 h-3 rounded-full bg-[#299F69] mt-1.5 mr-6"></span>
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
});
</script>
