<script setup lang="ts">
import ProgressCircle from '@/components/learn/learnUI/ProgressCircle.vue';
import { Button } from '@/components/ui/button';
import { LearnProgress } from '@/components/ui/progress';
import { CircleCheck, Lock, LockKeyhole } from 'lucide-vue-next';
import { ref } from 'vue';

interface Props {
    index?: number
    title?: string | 'title not set'
    progress: number
    description?: string | 'description not set'
    image?: string
    bg?: string
    locked?: boolean
    AllowProgress?: boolean
    moduleCount?: number
    isLatest?: boolean
}


const props = defineProps<Props>()


const bgDefined = () => {
    if (props.locked) {
        return 'bg-background border-[#35d1ac]';
    }

    if (props.bg) {
        return `bg-[${props.bg}] brightness-90`;
    } else {
        return 'bg-[#4f1c51] ';
    }

}

const showLocked = ref(false);
</script>

<template>
    
    <div class="p-3 rounded-xl shadow-2xl hover:opacity-100 hover:scale-103 duration-175 transition-all relative"
        :class="[isLatest ? 'border-[#dc9e3a] border-b-8 border-1' : 'opacity-40', bgDefined()]"
        :style="{ backgroundColor: props.bg && !props.locked ? props.bg : '' }"
        @mouseenter="showLocked = true" @mouseleave="showLocked = false"
        >
    
        <div class="p-4 flex flex-col-reverse sm:flex-row">
            <div class="flex flex-col flex-4 justify-between gap-5">
                <div class="flex flex-col gap-6">
                    <p class="font-extrabold text-xl">Module {{ index }}: {{ title }}</p>
                   
                    <div v-if="!locked">
                        <LearnProgress :model-value="progress" :tongue-color="props.bg"
                            :module-count="moduleCount" :isLatest="isLatest" position="left">
                        </LearnProgress>

                        <!-- <div v-else class="flex items-center gap-3 ">

                            <CircleCheck class="text-green-400 fill-slate-500" />
                            <p class="font-bold text-primary opacity-70">COMPLETED!</p>
                        </div> -->
                    </div>

                    <div v-else>
                        <div class="flex items-center ">
                            <div class="size-12 bg-secondary flex justify-center items-center rounded-full">
                                <LockKeyhole class="text-ternary" />
                            </div>
                            <div class="bg-secondary rounded-br-full rounded-tr-full px-5 py-1 relative -left-2">
                                <p class="font-bold text-ternary opacity-70 text-sm">LOCKED</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Button v-if="!locked"
                    class="text-background text-sm rounded-xl h-13 font-sans font-bold border-b-4 border-x-1 border-ternary/50"
                    :class="[isLatest ? 'bg-primary hover:border-b-1' : 'bg-[#dc9e3a] hover:bg-[#dc9e3a]/70 hover:border-b-1', `text-[${props.bg}]`]"
                    :style="{ color: isLatest ? props.bg : 'white' }">
                    CONTINUE
                </Button>
                <Button v-else
                    class="bg-ternary text-background text-sm rounded-xl h-13 font-sans font-bold border-b-4 border-x-1 border-secondary">
                    SEE LESSONS
                </Button>
            </div>

            <div class="flex grow h-50">
                <img :class="['object-scale-down mx-auto w-50', locked ? 'grayscale-100' : '']"
                    :src="image ? image : '/Human.webp'" alt="">
            </div>
        </div>

        <div v-if="showLocked && locked" class="absolute top-0 text-sm right-0 bg-secondary border-2 border-ternary p-4 rounded-xl motion-preset-slide-left">
            Complete all levels above to unlock
        </div>
    </div>
</template>



