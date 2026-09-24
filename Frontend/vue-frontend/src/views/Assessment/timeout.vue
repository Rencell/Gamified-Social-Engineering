<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { ChevronLeft, ServerCrash } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
const goBack = () => {
    router.push({name: 'Assessments'})
}
</script>

<template>
    <div class="flex flex-col items-center justify-center gap-4 min-h-screen bg-background p-4">
        <!-- Icon -->
        <div class="w-24 h-24 flex items-center justify-center bg-accent rounded-full mb-6 relative">
            <ServerCrash class="size-15" />
          
        </div>

        <!-- Heading -->
        <h1 class="text-2xl font-bold">Your session has expired</h1>

        <!-- Description -->
        <p class="mb-6 text-center text-ternary">
            Please refresh the page. Don't worry, we kept all of your filters and breakdowns in place.
        </p>

        <!-- Refresh Button -->
        <Button @click="goBack">
            <ChevronLeft></ChevronLeft>
            Back to Assessment
        </Button>
    </div>
</template>



<style scoped>
/* Optional: Add more styling if needed */
</style>