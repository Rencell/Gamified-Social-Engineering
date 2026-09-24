<template>
    <div v-if="isOpen" class=" fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="motion-preset-pop bg-secondary rounded-2xl p-8 max-w-md w-full relative flex flex-col items-center">
            <Button size="sm" variant="secondary"
                @click="onClose()"
                class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                <X />
            </Button>
            <h2 class="text-2xl font-bold text-white mb-2">Awesome Work!</h2>
            <p class="text-slate-400">You've unlocked something special</p>

            <!-- Display the current data item -->
            <div class="space-y-6 mb-5">
                <div class="flex justify-center items-center relative">
                    <div class="size-50 relative z-10 rounded-full flex justify-center items-center">
                        <div class="size-30">
                            <img :src="courseUnlock.courseImage" class="rounded-full object-cover" />
                        </div>
                    </div>
                    <img class="size-50 absolute opacity-30 animate-spin [animation-duration:15s]" :src="radial" />
                </div>

                <div class="flex flex-col items-center space-y-2">
                    <div class="text-yellow-400 font-extrabold text-lg animate-pulse">
                        {{courseUnlock.courseName}}
                    </div>
                    <div class="text-white text-sm">
                       {{courseUnlock.courseDescription}}
                    </div>
                </div>
            </div>


            <Button 
                class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 rounded-lg"
                @click="onClose()"
                >
                Continue
            </Button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { Button } from '../ui/button';
import radial from '/radial2.png';
import { useCourseUnlockStore } from '@/stores/pageCourseUnlock';

const courseUnlock = useCourseUnlockStore()

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    onClose: {
        type: Function,
        required: true,
    },
});
</script>

<style scoped>
@keyframes pop-out {
    0% {
        opacity: 0;
        transform: scale(0.8);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-parent>* {
    opacity: 0;
    animation: pop-out 0.5s ease-out forwards;
}
</style>
