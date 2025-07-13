<template>
  <div class="learning-list-container">
    <ul class="learning-list">
      <li v-for="(item, index) in items" :key="index" class="learning-list-item">
        <span class="bullet-point bg-accent"></span>
        <p class="item-text text-gray-300 text-sm/loose">{{ item }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  items: {
    type: Array as () => string[],
    required: true,
  },
});
</script>

<style scoped>
.learning-list-container {
  padding: 2rem;
  border-radius: 12px;
}

.learning-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.learning-list-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem; /* Spacing between items */
  line-height: 1.6;
}

.learning-list-item:last-child {
  margin-bottom: 0;
}

.bullet-point {
  flex-shrink: 0;
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 8px; /* Align with the text */
  margin-right: 4rem; /* Space between bullet and text */
  box-shadow: 0 0 10px rgba(66, 153, 225, 0.5); /* Subtle glow */
}

</style>
