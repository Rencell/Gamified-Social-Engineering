<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLoadingPageStore } from '@/stores/pageLoading';
import { Book, MagnetIcon, X } from 'lucide-vue-next';

const props = defineProps<{
    routerLink: string;
    total_contents: number | null | undefined;
    content_quiz: number | null | undefined;
    title: string;
}>();

const emit = defineEmits<{
    (e: 'toggle'): void;
}>();
</script>

<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="motion-preset-fade bg-secondary rounded-2xl p-8 max-w-md w-full relative">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div class="size-25 rounded-full p-5 bg-secondary brightness-180">
                    <img class="size-15 brightness-50" src="/Icons/Learns.svg?url" alt="">
                </div>
            </div>

            <Button @click="emit('toggle')" size="sm" variant="secondary"
                class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                <X />
            </Button>
            <div class="flex flex-col gap-6 pt-10">
                <p class="text-center font-bold text-2xl font-display">{{title}}</p>

                <div class="flex justify-center gap-3 text-sm font-semibold text-white/80">
                    <div v-if="total_contents != 0" class="flex gap-1 items-center">
                        <Book class="size-4 "></Book>
                        {{ total_contents }} Contents</div>
                    <div class="flex gap-1 items-center">

                        <MagnetIcon class="size-4 "></MagnetIcon>
                        {{ content_quiz ? String(content_quiz).replace(/([A-Z])/g, ' $1').trim() : '' }}</div>
                </div>
                <hr class="border-white/10" />
                <div class="flex flex-col gap-4 font-bold">
                    <RouterLink :to="routerLink " class="w-full">
                        <Button class="font-bold w-full">
                            Start Lesson
                        </Button>

                    </RouterLink>

                    <RouterLink v-show="String(content_quiz) !== 'ModuleReward'" :to="routerLink + '?openQuiz=true'" class="w-full">
                        <Button variant="ghost" class=" font-bold bg-background w-full">
                            Quiz
                        </Button>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>