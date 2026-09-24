<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'

type IntroStep = {
    title: string
    description?: string
    imageAlt?: string
    image?: string
}

const props = withDefaults(
    defineProps<{
        steps?: IntroStep[]
        showForUser?: boolean
        dialogTitle?: string
        dialogDescription?: string
    }>(),
    {
        showForUser: true,
        dialogTitle: 'How this quiz works',
        dialogDescription: 'Click Next to continue. You can close anytime.',
    },
)

const open = defineModel<boolean>('open', { default: false })
const activeIndex = ref(0)

const defaultSteps: IntroStep[] = [
    {
        title: 'Read the question',
        description: 'Take a moment to understand what is being asked before answering.',
        imageAlt: 'Placeholder image for step 1',
    },
    {
        title: 'Choose your answer',
        description: 'Select the best option. Some quizzes may be timed, so stay focused.',
        imageAlt: 'Placeholder image for step 2',
    },
    {
        title: 'Finish and review',
        description: 'At the end you will see your score and any rewards you earned.',
        imageAlt: 'Placeholder image for step 3',
    },
]

const steps = computed(() => (props.steps?.length ? props.steps : defaultSteps))
const currentStep = computed(() => steps.value[activeIndex.value] ?? steps.value[0])
const isFirst = computed(() => activeIndex.value <= 0)
const isLast = computed(() => activeIndex.value >= steps.value.length - 1)

watch(
    () => open.value,
    (isOpen) => {
        if (isOpen) activeIndex.value = 0
    },
)

const goTo = (index: number) => {
    if (index < 0 || index >= steps.value.length) return
    activeIndex.value = index
}

const next = () => {
    if (isLast.value) {
        open.value = false
        return
    }
    activeIndex.value += 1
}

const back = () => {
    if (isFirst.value) return
    activeIndex.value -= 1
}
</script>

<template>
    <Dialog v-model:open="open" :show-for-user="showForUser">
        <DialogTrigger as-child>
            <slot name="trigger">
                <Button variant="outline" size="sm">Instructions</Button>
            </slot>
        </DialogTrigger>

        <DialogContent class="sm:max-w-[760px]">
            <DialogHeader>
                <DialogTitle>{{ dialogTitle }}</DialogTitle>
                <DialogDescription>{{ dialogDescription }}</DialogDescription>
            </DialogHeader>

            <div class="mt-6">
                <Transition name="intro-step" mode="out-in">
                    <div :key="activeIndex" class="grid gap-6">
                        <div class="text-center space-y-2">
                            <h3 class="text-xl sm:text-2xl font-bold tracking-tight">{{ currentStep?.title }}</h3>
                            <p class="text-sm sm:text-base text-muted-foreground">
                                {{ currentStep?.description }}
                            </p>
                        </div>

                        <div class="flex justify-center">
                            <div class="w-full max-w-md aspect-video rounded-xl border bg-muted/20 overflow-hidden flex items-center justify-center"
                                :aria-label="currentStep?.imageAlt">
                                <img v-if="currentStep?.image" :src="currentStep.image"
                                    :alt="currentStep?.imageAlt ?? currentStep?.title"
                                    class="object-cover w-full h-full" loading="lazy" decoding="async" />
                                <div v-else class="flex items-center justify-center p-4">
                                    <span class="text-xs text-muted-foreground">Image placeholder</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>

                <div class="mt-6 flex items-center justify-center gap-2" aria-label="Instruction steps">
                    <button v-for="(_, i) in steps" :key="i" type="button"
                        class="h-2.5 w-2.5 rounded-full transition-colors"
                        :class="i === activeIndex ? 'bg-accent' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'"
                        :aria-label="`Go to step ${i + 1}`" @click="goTo(i)" />
                </div>
            </div>

            <DialogFooter class="mt-6 w-full">
                <div class="flex w-full items-center justify-between gap-3">
                    <Button variant="outline" :disabled="isFirst" @click="back">Back</Button>

                    <div class="flex items-center gap-2">
                        <Button v-if="!isLast" @click="next">Next</Button>
                        <DialogClose v-else as-child>
                            <Button @click="next">Done</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<style scoped>
.intro-step-enter-active,
.intro-step-leave-active {
    transition: opacity 180ms ease, transform 180ms ease;
}

.intro-step-enter-from {
    opacity: 0;
    transform: translateX(10px);
}

.intro-step-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}
</style>