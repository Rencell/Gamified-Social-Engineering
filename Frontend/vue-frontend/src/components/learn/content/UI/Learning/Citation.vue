<template>
  <span class="citation-container">
    <a :href="citationLink" target="_blank" rel="noopener noreferrer" class="highlighted-word" @mouseover="showTooltip"
      @mouseleave="hideTooltip">
      {{ word }}
    </a>
    <div v-if="tooltipVisible"
      class="tooltip max-w-xs truncate whitespace-nowrap overflow-hidden text-ellipsis bg-gray-800 text-white px-3 py-1 rounded"
      :title="citationLink">
      {{ citationLink }}
    </div>

  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  word: {
    type: String,
    required: true
  },
  citationLink: {
    type: String,
    required: true
  }
})

const tooltipVisible = ref(false)

const showTooltip = () => {
  tooltipVisible.value = true
}

const hideTooltip = () => {
  tooltipVisible.value = false
}
</script>

<style scoped>
.citation-container {
  position: relative;
  display: inline-block;
}

.highlighted-word {
  text-decoration: underline;
  cursor: pointer;
  color: inherit;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 99;
}
</style>
