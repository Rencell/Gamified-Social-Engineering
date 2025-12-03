<script setup lang="ts">
import { Button } from '@/components/ui/button';

// Ensure multi-word component name to satisfy lint rule
defineOptions({ name: 'AssessmentFooter' });

const emit = defineEmits<{
    (e: 'handle'): void;
}>();

const handleCheckClick = () => {
    emit('handle');
};

</script>

<template>
    <div class="flex flex-col items-center gap-6 animate-in fade-in bg-background border-t-1 border-ternary p-4 sm:p-6 w-full">
        <!-- Continue Button -->
        <Button
            class="mt-4 border-primary/50 bg-blue-500 w-full sm:w-80 md:w-[28rem] lg:w-[36rem] xl:w-[48rem] p-3 sm:p-4 md:p-6 font-bold"
            @click="handleCheckClick"
            aria-label="Check"
        >
            Check
        </Button>
    </div>
</template>