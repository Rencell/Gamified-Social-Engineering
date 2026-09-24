<script lang="ts" setup>
import { AlertTriangle, X } from 'lucide-vue-next';
import { Button } from '../../button';
import { useRouter } from 'vue-router';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        title?: string
        topic?: string
        primaryLine?: string
        secondaryLine?: string
        avoidCta?: string
        progressDuration?: number
    }>(),
    {
        title: 'Oh no! Popup clicked.',
        topic: 'Topic',
        primaryLine: 'To learn how to avoid this mistake',
        secondaryLine: 'check out the topic',
        avoidCta: 'Read tips to avoid this',
        progressDuration: 10_000,
    },
)

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'avoid'): void
}>()


const router = useRouter();
const goToTips = () => {
    emit('close')
    router.replace({ path: '/safe-browsing', query: { openQuiz: 'true' } })
}

const progressBar = ref(1);
let intervalId: number | undefined;
onMounted(() => {
    const tickMs = 100;
    const step = tickMs / props.progressDuration;
    intervalId = window.setInterval(() => {
        progressBar.value = Math.max(0, progressBar.value - step);
        if (progressBar.value === 0 && intervalId !== undefined) {
            window.clearInterval(intervalId);
            intervalId = undefined;
        }
    }, tickMs)
})

onUnmounted(() => {
    if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
    }
})

const progressPct = computed(() => `${progressBar.value * 100}%`);
</script>

<template>
    <div class="relative w-full overflow-hidden rounded-lg border border-destructive bg-popover px-4 py-3 text-foreground"
        role="status" aria-live="polite">
        <div class="flex flex-col items-start gap-4 ps-3 py-2">
            
            <div class="min-w-0 flex-1 pe-2 space-y-4">
                <div class="flex items-center gap-3">
                    <div class="grid size-9 shrink-0 place-items-center rounded-full bg-destructive/20 text-white"
                        aria-hidden="true">
                        <AlertTriangle class="size-5" />
                    </div>

                    <div class="min-w-0 flex-1">
                        <p class="truncate text-base font-semibold font-display">
                            {{ title }}
                        </p>
                    </div>

                    <button type="button"
                        class="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Close" @click="emit('close')">
                        <X class="size-4" />
                    </button>
                </div>

                <div class="mt-2 space-y-0.5 text-sm text-muted-foreground font-display">
                    <p class="truncate">{{ primaryLine }}</p>
                    <p class="truncate">{{ secondaryLine }}</p>
                </div>

            </div>
            <Button variant="destructive" class="w-full mt-3 py-2" @click="goToTips">
                {{ avoidCta }}
            </Button>
        </div>

        <div class="absolute inset-x-0 bottom-0 h-1 bg-border/40">
            <div class="h-full bg-destructive transition-all"
                :style="{ width: progressPct }" aria-hidden="true" />
        </div>
    </div>
</template>