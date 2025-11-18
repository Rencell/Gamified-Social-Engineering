<template>
    <div class="space-y-8 flex flex-col items-center w-full max-w-5xl">
        <h2 class="w-full text-2xl font-display font-bold text-white text-center text-pretty">
            {{ question.text }}
        </h2>

        <div class="w-full">
            <div :class="isAnimationFinished ? 'animate-in fade-in duration-500' : 'opacity-0'">
                <div class="grid grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
                    <div 
                        v-for="(option, key) in question.options" 
                        :key="option.id || key" 
                        :class="[
                            'group cursor-pointer transition-all duration-300 border-3 rounded-xl overflow-hidden',
                            getCardClass(option.id || key)
                        ]" 
                        @click="handleAnswerSelect(option)"
                    >
                        <!-- Fixed Size Image Container -->
                        <div class="relative bg-gray-100 overflow-hidden w-full h-64">
                            <img 
                                :src="option.image || `https://via.placeholder.com/300x256/1e293b/64748b?text=Option+${String.fromCharCode(65 + key)}`"
                                :alt="`Option ${String.fromCharCode(65 + key)}`"
                                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                @error="handleImageError"
                            />
                            
                            <!-- Option Label Overlay -->
                            <div class="absolute top-3 left-3 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center">
                                <span class="text-white font-bold text-base">
                                    {{ String.fromCharCode(65 + key) }}
                                </span>
                            </div>
                            
                            <!-- Selected Indicator -->
                            <div 
                                v-if="selectedOption?.id === (option.id || key)"
                                class="absolute inset-0 bg-blue-500/20 flex items-center justify-center backdrop-blur-sm"
                            >
                                <div class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Option Text (if available) -->
                        <div v-if="option.text" class="p-4 bg-secondary/50">
                            <p class="text-slate-200 text-base font-medium text-center">
                                {{ option.text }}
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Fallback for no options -->
                <div v-if="!question.options || question.options.length === 0" 
                     class="p-8 text-center border-2 border-dashed border-gray-400 rounded-xl max-w-md mx-auto">
                    <div class="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <p class="text-gray-500">No image options available</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="h-20"></div>
    </div>
</template>

<script setup lang="ts">
import type { Option, Question } from '@/services/assessmentService';
import { computed, ref, onMounted } from 'vue';

const props = defineProps<{
    questions: Question;
}>();

const emit = defineEmits<{
    answerSelected: [option: Option];
}>();

const question = computed(() => {
    return props.questions;
});

// Animation state
const isAnimationFinished = ref(false);

// Selected option state
const selectedOption = ref<Option | null>(null);

const getCardClass = (optionId: string | number) => {
    if (selectedOption.value?.id === optionId) {
        return 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/25 scale-[1.02] ring-2 ring-blue-400';
    }
    return 'border-slate-600 bg-secondary/30 hover:bg-secondary/50 hover:border-slate-400 hover:shadow-md hover:scale-[1.01]';
};

onMounted(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
        isAnimationFinished.value = true;
    }, 100);
});

const handleAnswerSelect = (option: Option) => {
    selectedOption.value = option;
    emit('answerSelected', option);
};

const handleImageError = (event: Event) => {
    // Fallback image when original fails to load
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x256/374151/9ca3af?text=No+Image';
};
</script>

<style scoped>
/* Enhanced animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fade-in;
}

.duration-500 {
  animation-duration: 500ms;
}

/* Custom border width */
.border-3 {
    border-width: 3px;
}

/* Smooth hover transitions */
.group:hover img {
    transform: scale(1.05);
}
</style>