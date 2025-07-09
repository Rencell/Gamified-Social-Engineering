<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import { ArrowRight } from 'lucide-vue-next';
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    routerLink: {
        type: String,
        required: true
    },
    interactive: {
        type: Boolean,
        default: false
    }
});
</script>

<template>


    <div class="flex gap-3 group">


        <div class="grow my-2 p-3 flex items-center rounded-xl bg-secondary gap-6">
            <div :class="interactive ? 'flex' : 'opacity-0' " class="items-center justify-center">
                <div class="w-12 h-12 relative mx-auto">
                    <!-- Gray background circle -->
                    <svg class="w-full h-full" viewBox="0 0 36 36">
                        <circle class="stroke-current text-background" stroke-width="4" fill="none" cx="18" cy="18"
                            r="16"></circle>
                    </svg>
                    <!-- Progress circle -->
                    <svg class="w-full h-full absolute top-0 left-0" viewBox="0 0 36 36">
                        <circle class="stroke-current text-accent transition-all" stroke-width="4"
                            stroke-dasharray="100" stroke-dashoffset="calc((100 - 0.1) )" fill="none" cx="18" cy="18"
                            r="16" stroke-linecap="round" transform="rotate(-90 18 18)">
                        </circle>
                    </svg>
                    <!-- Center Text (optional) -->
                    <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    </div>
                </div>
            </div>
            
            <div class="grow gap-3 space-y-3 flex justify-between items-center">
                <div class="font-semibold">{{ title }}</div>
                <Button asChild size="sm" class="font-semibold bg-accent">
                    <RouterLink :to="routerLink">
                        Start <ArrowRight :size="18"></ArrowRight>
                    </RouterLink>
                    
                </Button>

            </div>


        </div>
    </div>



</template>