<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useContentStore } from '@/stores/content';
const contentStore = useContentStore();
</script>

<template>
    <Button @click="contentStore.updateContentsQuiz()">Save</Button>
</template>