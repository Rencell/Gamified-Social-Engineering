<template>
    <div v-if="isAnswered" class="fixed rounded-b-none bottom-0 font-display z-50 flex flex-col gap-6 animate-in fade-in border-t-2 w-full sm:w-4xl p-5 backdrop-blur shadow-md"
        :class="isCorrect ? ' bg-green-950' : 'bg-[#2c030b]'" >
        <div>
            <div class="mb-2 flex gap-2">
                <template v-if="isCorrect">
                    <div class="p-1 rounded-full bg-green-500 w-fit"><Check :stroke-width="4"></Check></div>
                </template>
                <template v-else>
                    <div class="p-1 rounded-full bg-red-500 w-fit"><X :stroke-width="4"></X></div>
                </template>

                <span class="font-bold text-2xl" :class="isCorrect ? 'text-green-500' : 'text-red-500'">
                    {{ isCorrect ? 'Correct!' : 'Incorrect' }}
                </span>
            </div>
            <div class="flex flex-col gap-2 border-s-4 ps-4 text-sm font-semibold"
                :class="isCorrect ? 'border-green-500' : 'border-red-500'">
                <div class="font-bold text-lg">
                    Hint
                </div>
                <p class="font-extralight font-sans">{{ explanation }}</p>
            </div>
        </div>

        <!-- Continue Button -->
        <Button :disabled="loading" v-if="isAnswered" class="mt-4 border-primary/50 text-sm"
            :class="isCorrect ? 'bg-green-500' : 'bg-red-500'"
            @click="toggleNext">
            Continue
        </Button>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-vue-next';
import { ref } from 'vue';


const emit = defineEmits(['toggleNext']);

const loading = ref(false)
const toggleNext = ()   => {
    loading.value = true
    setTimeout(() => {
        loading.value = false
        emit('toggleNext');
    }, 1000); 
};

const props = defineProps<{
    isCorrect: boolean;
    explanation: string;
    isAnswered: boolean;
}>();
</script>