<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import learns from '/Icons/Learns.svg?url'
import { ChevronDown, ChevronUp, Clock, LockKeyhole, Play, RotateCcw, SquarePen, Target } from 'lucide-vue-next';
import UpdateModuleDialog from '../dialog/Lesson/Section/Module/updateModuleDialog.vue'
import type { ModuleTest } from '@/services/moduleService';
import { ref } from 'vue';
import ProgressCircle from './ProgressCircle.vue'
import DeleteModuleAlert from '../dialog/Lesson/Section/Module/deleteModuleAlert.vue';
import ModuleViewDialog from '../dialog/Lesson/Section/Module/moduleViewDialog.vue'
import { useLoadingPageStore } from '@/stores/pageLoading';
import Badge from '@/components/ui/badge/Badge.vue';
import type { Quiz } from '@/services/quizService';


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
    },
    lessonkey: {
        type: Number,
        required: true
    },
    lockedIndex: {
        type: Boolean,
        default: false
    },
    module: {
        type: Object as () => ModuleTest,
        required: true
    },
    quizStatus: {
        type: Object as () => Quiz,
        default: undefined
    },
    quizProgress: {
        type: Number,
        default: 0
    }
});

const showSettings = ref(true)
const showModal = ref(false)
const toggleShowModal = () => {
    useLoadingPageStore().count = 0;
    showModal.value = !showModal.value;
}

const showDetails = ref(false);
const toggleDetails = () => {
    showDetails.value = !showDetails.value;
};

const formatTime = (time: number | undefined): string => {
    if (!time) return '0s';
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}m ${seconds}s`;
};


</script>

<template>
    <div class="flex gap-3 group">
        <div class="grow my-2 p-2 flex items-center rounded-xl bg-secondary gap-6">

            <div class="flex items-center justify-center pl-5 space-x-3">
                <div class="p-1 px-2 rounded-full flex items-center "
                    :class="!showSettings ? 'bg-ternary' : 'bg-secondary'">
                    <Button @click="showSettings = !showSettings" size="sm" variant="ghost">
                        <SquarePen class="size-4" />
                    </Button>
                    <DeleteModuleAlert v-if="!showSettings" :module="module" />
                    <UpdateModuleDialog v-if="!showSettings" :module="module" />
                </div>
                <img class="w-10 h-10" :src="learns" alt="">
            </div>

            <div
                class="grow gap-3 space-y-3 flex flex-col sm:flex-row justify-between items-start sm:items-center pr-5 p-2">
                <div class="font-semibold text-sm space-y-3">
                    <p class="uppercase text-xs font-bold text-slate-600">Lesson {{ lessonkey }} </p>
                    <p>
                        {{ title }}
                        <Button @click="toggleDetails" size="sm" variant="ghost">
                            <ChevronDown v-if="!showDetails" class="inline size-4 rounded hover:bg-accent/50" />
                            <ChevronUp v-else class="inline size-4 rounded hover:bg-accent/50" />
                        </Button>
                    </p>
                    <!-- Details Section -->
                    <div v-if="showDetails" class="flex gap-4 text-xs">
                        <div class="flex gap-1 items-center">
                            <Target class="w-4 h-4 text-accent" />Accuracy: <p class="text-green-500">{{quizProgress.toFixed(1)}}%</p>
                        </div>
                        <div class="flex gap-1 items-center">
                            <RotateCcw class="w-4 h-4 text-accent" />
                            Attempts: <p class="text-yellow-500">{{ quizStatus?.attempt_number || 0 }}</p>
                        </div>
                        <div class="flex gap-1 items-center">
                            <Clock class="w-4 h-4 text-accent" />Time: <p class="text-red-500">{{ formatTime(quizStatus?.time_spent) }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                   
                    <ModuleViewDialog v-if="showModal" @toggle="toggleShowModal"
                        :total_contents="module.contents_length" :content_quiz="module.content_quiz" :title="module.title"
                        :routerLink="routerLink" />
                    <Button v-if="!lockedIndex" @click="toggleShowModal" variant="ghost" size="lg"
                        class="w-full sm:w-auto font-semibold border-2 "
                        :class="interactive ? 'border-green-500' : 'border-ternary'">
                        <!-- <RouterLink class="flex gap-2 items-center"> -->

                        <Play :size="18" fill="white"></Play>
                        <p v-if="!interactive" class="font-bold">Learn</p>
                        <p v-else class="font-bold">Review</p>
                        <!-- </RouterLink> -->
                    </Button>
                    <div v-else class="text-ternary text-sm font-semibold flex">
                        Complete the previous lessons to unlock

                        <!-- <div class="flex items-center">
                            <img src="/Learning/crown_locked.svg" class="size-10" alt="">
                            <img src="/Learning/crown_locked.svg" class="size-10" alt="">
                            <img src="/Learning/crown_locked.svg" class="size-10" alt="">
                        </div>
                        <Button asChild variant="ghost" size="lg"
                            class="w-full sm:w-auto font-semibold border-1 border-ternary">
                            <RouterLink :to="routerLink">
                                <Play :size="18" fill="white"></Play>
                                <p class="font-bold">Learn</p>
                            </RouterLink>

                        </Button> -->
                    </div>

                    <div v-if="!lockedIndex">
                        <!-- <Circle class="text-slate-600"  v-if="!interactive" /> -->
                        <!-- <CircleCheck v-else class="text-green-400" fill="green" /> -->
                        <ProgressCircle :progress="quizStatus?.accuracy ? parseFloat(quizStatus.accuracy.toFixed(1)) : 0" size="lg" />

                    </div>
                    <div v-else>
                        <div class="border-6 border-white/20 rounded-full">
                            <div class="bg-secondary size-10 rounded-full flex items-center justify-center">

                                <LockKeyhole class="text-slate-600 size-5" />

                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div>

    </div>



</template>