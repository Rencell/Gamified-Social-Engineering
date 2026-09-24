<template>
    <div v-if="isOpen" class=" fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="motion-preset-pop bg-secondary rounded-2xl p-8 max-w-md w-full relative">
            <Button size="sm" variant="secondary" @click="onClose()" class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                <X/>
            </Button>

            <div class="flex items-start gap-4 mb-6">
                <div class="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center">
                       
                        <img :src="fire" class="size-10" />
                    </div>
                </div>
                <div>
                    <h2 class="text-white text-2xl font-bold text-balance font-display">{{streakDays}} day Streak!
                    </h2>
                    <p class="text-white/80 text-sm mt-1 text-pretty font-display">Practice everyday so your streak
                        won't reset</p>
                </div>
            </div>

            <div class="mb-8 ">
                <div class="flex justify-between mb-3">
                    <div v-for="(day, index) in weekDays" :key="index"
                        class="text-white/60 text-sm font-medium w-8 text-center">
                        {{ day }}
                    </div>
                </div>

                <div class="flex justify-between animate-parent">
                    <div v-for="(_, index) in weekDays" :key="index" class="w-8 h-8 flex items-center justify-center">
                        <div v-if="isActive(index)"
                            class="w-8 h-8 bg-orange-500/50 rounded-full flex items-center justify-center">
                            <img :src="fire" class="w-4 h-4 text-white" />
                        </div>
                        <div v-else class="w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center">
                            <img :src="fire_greyed" class="w-4 h-4 text-white" />

                        </div>
                    </div>
                </div>
            </div>

            <Button @click="onClose()"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg">
                Challenge Accepted!
            </Button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, defineProps, onMounted, watch } from "vue";
import { Button } from "@/components/ui/button";
import fire from '/Learning/fire.svg'
import fire_greyed from '/Learning/fire-greyed.svg'
import { useStreakStore } from '@/stores/pageStreak';
import dayjs from 'dayjs';
import { X } from "lucide-vue-next";

const streakStore = useStreakStore();
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


const weekDays = ref(["S", "M", "T", "W", "T", "F", "S"]);

const activeDays = ref<string[]>(); // Array of active days in "YYYY-MM-DD" format

const isActive = (dayIndex: number): boolean => {
    const weekStart = dayjs().startOf('week'); 
    const date = weekStart.add(dayIndex, 'day').format('YYYY-MM-DD');
    
    return (activeDays.value ?? []).includes(date);
}

const streakDays = ref(0)
watch(() => props.isOpen, async (newVal) => {
    if (newVal) {
        await streakStore.updateStreak();
        const res = streakStore.data;
        activeDays.value = res?.active_days; // Populate active days
        streakDays.value = streakStore.streakData?.current_streak || 0;
    }
}, { immediate: true, deep: true });
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
.animate-parent > * {
    opacity: 0;
    animation: pop-out 0.5s ease-out forwards;
}

/* Optional: staggered effect */
.animate-parent > *:nth-child(1) {
  animation-delay: 0.3s;
}
.animate-parent > *:nth-child(2) {
  animation-delay: 0.5s;
}
.animate-parent > *:nth-child(3) {
  animation-delay: 0.7s;
}
.animate-parent > *:nth-child(4) {
  animation-delay: 0.9s;
}
.animate-parent > *:nth-child(5) {
  animation-delay: 1.1s;
}
.animate-parent > *:nth-child(6) {
  animation-delay: 1.3s;
}
.animate-parent > *:nth-child(7) {
  animation-delay: 1.5s;
}
.animate-parent > *:nth-child(8) {
  animation-delay: 1.7s;
}
</style>
