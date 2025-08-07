<script setup lang="ts">
import ModuleReward from '@/components/learn/rewardUI/moduleReward.vue'

const props = defineProps<{
  totalLength: number
}>();
</script>
<template>
    <ModuleReward :total-length="props.totalLength" />
</template>