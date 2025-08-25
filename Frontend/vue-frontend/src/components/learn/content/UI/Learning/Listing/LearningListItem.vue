<template>
  <li class="flex items-center justify-between mb-4">
    <div class="flex items-center">
      <span class="flex-shrink-0 inline-block w-3 h-3 rounded-full bg-[#299F69] mr-6"></span>
      <div
        :class="[
          'text-gray-200 font-medium',
          size === 'lg' ? 'text-base/loose' : 'text-sm/loose'
        ]"
      >
        <slot></slot>
      </div>
    </div>
    <img v-if="image" :src="image" alt="list item image" class="w-15 h-15 object-cover rounded-md ml-6" />
  </li>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  image: {
    type: String,
    default: null,
  },
  size: {
    type: String as () => 'lg' | 'sm',
    default: 'sm',
  },
});
</script>
