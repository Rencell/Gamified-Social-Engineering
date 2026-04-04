<script lang="ts" setup>
import { Check, X } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(
    defineProps<{
        totalXp?: number
        lessonXp?: number
        streakXp?: number
        streakPercent?: number
        streakLabel?: string
        progressDuration?: number
    }>(),
    {
        totalXp: 121,
        lessonXp: 120,
        streakXp: 1,
        streakPercent: 1,
        streakLabel: 'Daily Streak',
        progressDuration: 5000,
    },
)

const emit = defineEmits<{
    (e: 'close'): void
}>()


const progressBar = ref(1);
onMounted(() => {
    setInterval(() => {
        if (progressBar.value >= 0) {
            progressBar.value -= 100 / props.progressDuration;
        } else {
            clearInterval(this);
        }
    }, 100)
})

const progressPct = computed(() => `${progressBar.value * 100}%`);

</script>

<template>
    <div class="relative w-full overflow-hidden rounded-lg border border-popover-foreground bg-popover px-4 py-3 text-foreground"
        role="status" aria-live="polite">
        <div class="flex items-center gap-5 ps-3 py-2">
            <div class="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-foreground text-background"
                aria-hidden="true">
                <Check class="size-4" />
            </div>

            <div class="min-w-0 flex-1 ps-2 pe-4">
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <p class="truncate text-base font-semibold">
                            Gained +{{ props.totalXp }} xp
                        </p>
                    </div>


                </div>

                <div class="mt-1 space-y-0.5 text-sm text-muted-foreground font-display">
                    <div class="flex items-center justify-between gap-3">
                        <p class="truncate">+{{ props.lessonXp }} xp (Lesson)</p>
                        <span class="shrink-0" />
                    </div>

                    <div class="flex items-center justify-between gap-3">
                        <p class="truncate">+{{ props.streakXp }} xp ({{ props.streakPercent }}%)</p>
                        <p class="shrink-0 truncate">{{ props.streakLabel }}</p>
                    </div>
                </div>
            </div>

            <button type="button"
                class="-mr-1 -mt-1 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close" @click="emit('close')">
                <X class="size-4" />
            </button>
        </div>

        <div class="absolute inset-x-0 bottom-0 h-1 bg-border/40">
            <div class="h-full bg-popover-foreground transition-all " :style="{ width: progressPct }" aria-hidden="true" />
        </div>
    </div>
</template>