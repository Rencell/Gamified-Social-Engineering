<script setup lang="ts">

defineProps<{
    isCorrect: boolean;
    explanation: string;
}>();
const emit = defineEmits(['toggleNext'])

const nextQuestion = () => {
    emit('toggleNext')
}

</script>

<template>
    <div class="fixed bottom-0 z-50" :class="isCorrect ? ' bg-green-950' : 'bg-[#2c030b]'">
        <div class="mb-2 ">
            <span class="font-bold" :class="isCorrect ? 'text-green-500' : 'text-red-500'">{{ isCorrect ? 'Correct!'
                : 'Incorrect' }}</span>
        </div>
        <div class="text-sm border-s-4 ps-4 flex justify-between items-center"
            :class="isCorrect ? 'border-green-500' : 'border-red-500'">
            <p>{{ explanation }}</p>
            <Button @click="nextQuestion()"
                :class="isCorrect ? 'bg-green-500' : 'bg-red-500 hover:bg-red-500/70'">Next</Button>
        </div>

    </div>

</template>