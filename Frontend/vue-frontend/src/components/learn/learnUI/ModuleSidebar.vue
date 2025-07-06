<script setup lang="ts">
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import ModuleSidebarItem from './ModuleSidebarItem.vue';
import { useLearningStore } from '@/stores/learning';

const learningStore = useLearningStore();
</script>

<template>
    <div class="sticky top-0 self-start">
        <div class="bg-secondary rounded-lg">

            <RouterLink :to="{ name: 'Learn-Phishing' }"
                class="p-4 flex gap-2 text-sm items-center text-accent border-b-1 border-background">

                <ArrowLeft :size="15"></ArrowLeft> Back

            </RouterLink>
            <div class="p-4 ">
                <div class="flex justify-between">

                    <p class="font-semibold text-xl">All lessons</p>

                    <div class="gap-2 flex">
                        <Button size="sm" variant="outline">
                            <ChevronLeft :size="17"></ChevronLeft>
                        </Button>
                        <Button size="sm" variant="outline">
                            <ChevronRight :size="17"></ChevronRight>
                        </Button>
                    </div>
                </div>
                <slot></slot>
                
            </div>
        </div>
    </div>
</template>
