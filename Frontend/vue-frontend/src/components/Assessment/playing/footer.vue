<script setup lang="ts">
import { Button } from '@/components/ui/button';

const emit = defineEmits<{
    (e: 'handle'): void;
}>();

const handleCheckClick = () => {
    emit('handle');
};

</script>

<template>
    <div class="flex flex-col items-center gap-6 animate-in fade-in bg-background border-t-1 border-ternary p-6">

        <!-- Continue Button -->
        <Button class="mt-4 border-primary/50 bg-blue-500 w-4xl p-6 font-bold" @click="handleCheckClick">
            Check
        </Button>

    </div>
</template>