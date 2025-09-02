<template>
    <div v-if="isAnswered" class="z-50 flex flex-col gap-6 animate-in fade-in bg-secondary border-t-2 border-ternary bottom-0 p-5 rounded-xl" 
    style="width: calc(100% - 20px); left: 10px; right: 10px;" >
        <div>
            <div class="mb-2">
                <span class="font-bold text-xl" :class="isCorrect ? 'text-green-500' : 'text-red-500'">
                    {{ isCorrect ? 'Correct!' : 'Incorrect' }}
                </span>
            </div>
            <div class="flex flex-col gap-2 border-s-4 ps-4 text-sm font-semibold"
                :class="isCorrect ? 'border-green-500' : 'border-red-500'">
                <div class="font-bold text-lg">
                    Hint
                </div>
                <p>{{ explanation }}</p>
            </div>
        </div>

        <!-- Continue Button -->
        <Button :disabled="loading" v-if="isAnswered" class="mt-4 border-primary/50 "
            :class="isCorrect ? 'bg-green-500' : 'bg-red-500'"
            @click="toggleNext">
            Next
        </Button>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
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
    isAnswered: boolean;
    explanation: string;
}>();
</script>