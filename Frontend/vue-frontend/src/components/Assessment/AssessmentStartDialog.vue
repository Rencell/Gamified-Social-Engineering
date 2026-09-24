<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Clock, FileText, X } from 'lucide-vue-next';
import { ref } from 'vue';
import { Spinner } from '../ui/spinner';
import type { Assessment } from '@/services/assessmentService';
const emit = defineEmits<{
    (e: 'toggle'): void;

    (e: 'startAssessment'): void;
}>(); 

const loading = ref(false);

defineProps<{
    data: Assessment;
}>();

const startAssessment = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        emit('startAssessment');
    }, 2000);
};


</script>

<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="motion-preset-fade bg-secondary rounded-2xl p-8 max-w-md w-full relative">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div class="size-25 rounded-full p-5 bg-secondary brightness-180">
                    <img class="size-15 brightness-50" src="/Icons/assess.svg?url" alt="">
                </div>
            </div>

            <Button @click="emit('toggle')" size="sm" variant="secondary"
                class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                <X />
            </Button>
            <div class="flex flex-col gap-6 pt-10">
                <p class="text-center font-bold text-2xl font-display">{{data.name}}</p>

                <!-- Description -->
                <p class="text-slate-400 text-sm leading-relaxed max-w-md text-center">
                    {{ data.description }}
                </p>
                <div class="flex justify-center gap-3 text-sm font-semibold text-white/80">
                    <!-- Metadata -->
                    <div class="flex items-center justify-center gap-6 text-slate-400 text-sm">
                        <div class="flex items-center gap-2">
                            <Clock :size="18" />
                            <span>{{ data.duration }} mins</span>
                        </div>
                        <div class="w-px h-4 bg-slate-700" />
                        <div class="flex items-center gap-2">
                            <FileText :size="18" />
                            <span>{{ data.question_count }} questions</span>
                        </div>
                    </div>
                </div>
                <hr class="border-white/10" />
                <div class="flex flex-col gap-4 font-bold">
                    <Button class="font-bold w-full" size="lg" @click="startAssessment">
                        <Spinner variant="white" size="sm" v-if="loading" ></Spinner>
                        {{ loading ? 'Starting...' : 'Start Assessment' }}
                    </Button>


                </div>
            </div>
        </div>
    </div>
</template>