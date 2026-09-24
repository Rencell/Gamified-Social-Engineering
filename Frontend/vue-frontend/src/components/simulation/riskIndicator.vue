<script setup lang="ts">
import { computed } from 'vue';

// Define props
const props = defineProps({
  score: {
    type: Number,
    required: true,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  riskLevel: {
    type: String as () => 'low' | 'medium' | 'high',
    required: true,
  },
});

// Compute the percentage
const percentage = computed(() => Math.min((props.score / props.maxScore) * 100, 100));

// Risk configuration
const riskConfig = {
  high: {
    label: 'HIGH RISK',
    color: 'bg-[#ef4444]',
    barColor: 'bg-[#ef4444]',
    textColor: 'text-[#ef4444]',
    range: [0, 30], // Add range for dynamic conditions
  },
  medium: {
    label: 'MEDIUM RISK',
    color: 'bg-[#ff6b35]',
    barColor: 'bg-[#ff6b35]',
    textColor: 'text-[#ff6b35]',
    range: [31, 70], // Add range for dynamic conditions
  },
  low: {
  label: 'LOW RISK',
  color: 'bg-[#10b981]',
  barColor: 'bg-[#10b981]',
    textColor: 'text-[#10b981]',
    range: [71, 100], // Add range for dynamic conditions
  },
};

// Get the configuration for the current risk level
const config = computed(() => riskConfig[props.riskLevel]);
</script>

<template>
  <div class="relative">
    <!-- Background bar -->
    <div class="flex gap-2 h-12 overflow-hidden bg-[#1a2332]">
      <!-- Loop through riskConfig -->
      <div
        v-for="(risk, key) in riskConfig"
        :key="key"
        :class="[
          'relative rounded-md',
          risk.barColor,
          percentage >= risk.range[0] && percentage <= risk.range[1] ? 'flex-3' : 'flex-1'
        ]"
      >
        <div
          v-if="percentage >= risk.range[0] && percentage <= risk.range[1]"
          class="absolute inset-0 flex items-center justify-center"
        >
          <span :class="`text-xs font-bold text-black`">{{ risk.label }}</span>
        </div>
      </div>
    </div>

    <!-- Score indicator triangle -->
    <div
      class="absolute -bottom-2 -translate-x-1/2 rotate-180 transform"
      :style="{ left: `${percentage}%` }"
    >
      <div class="h-0 w-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white" />
    </div>
  </div>
</template>