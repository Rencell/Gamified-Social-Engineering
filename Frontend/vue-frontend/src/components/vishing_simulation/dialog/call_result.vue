<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { showExpToast } from '@/components/ui/sonner/ExpToast/ExpToast';
import { playSoundFx, SoundFx } from '@/composables/useSoundFx';
import { AlertTriangle, CheckCircle2, PhoneCall, X } from 'lucide-vue-next';
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import { useRouter } from 'vue-router';

const props = defineProps<{
    callResult: string;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

type ResultView = {
    key: string;
    title: string;
    description: string;
    details?: string;
    buttonText: string;
    buttonVariant?: 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost' | 'link';
    icon: typeof CheckCircle2 | typeof AlertTriangle | typeof PhoneCall;
    iconWrapClass: string;
    iconClass: string;
};

const resultKey = computed(() => (props.callResult ?? '').trim().toLowerCase());

const view = computed<ResultView>(() => {
    if (resultKey.value === 'refused') {
        return {
            key: 'refused',
            title: 'Success Message',
            description: 'You refused to share information during the call.',
            details:
                'That’s the safest response. If this were real, hang up and call back using an official number.',
            buttonText: 'Continue',
            buttonVariant: 'default',
            icon: CheckCircle2,
            iconWrapClass: 'bg-emerald-50 ring-emerald-100',
            iconClass: 'text-emerald-600',
        };
    }

    if (resultKey.value === 'gave_information') {
        return {
            key: 'gave_information',
            title: 'Failed Message',
            description: 'You shared information during the call.',
            details:
                'Real attackers pressure you to act quickly. Pause, verify the caller, and avoid sharing personal details.',
            buttonText: 'Beware Next Time',
            buttonVariant: 'destructive',
            icon: AlertTriangle,
            iconWrapClass: 'bg-red-50 ring-red-100',
            iconClass: 'text-red-600',
        };
    }

    return {
        key: 'unknown',
        title: 'Call Summary',
        description: 'No summary available for this call.',
        buttonText: 'Go to homepage',
        buttonVariant: 'secondary',
        icon: PhoneCall,
        iconWrapClass: 'bg-slate-50 ring-slate-200',
        iconClass: 'text-slate-700',
    };
});

const nextRoute = computed<RouteLocationRaw>(() => {
    if (props.callResult === 'gave_information') {
        playSoundFx(SoundFx.failure);
        return {
            path: '/vishing-simulation',
            query: { openQuiz: 'true' },
        };
    } else if (props.callResult === 'refused') {
        showExpToast();
    }
    
    return '/home';
});

const router = useRouter();

const handleNavigate = async () => {
    emit('close');
    await router.push(nextRoute.value);
};

const handleClose = () => {
    emit('close');
};
</script>

<template>
    <div class="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-6 font-display">
        <div class="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
            <Button
                variant="ghost"
                size="icon"
                class="absolute right-3 top-3 text-slate-500 hover:text-slate-900"
                aria-label="Close"
                @click="handleClose"
            >
                <X class="h-4 w-4" />
            </Button>

            <div
                class="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full ring-1"
                :class="view.iconWrapClass"
            >
                <component :is="view.icon" class="h-8 w-8" :class="view.iconClass" />
            </div>

            <h2 class="text-center text-xl font-semibold text-slate-900">
                {{ view.title }}
            </h2>

            <p class="mt-2 text-center text-sm leading-6 text-slate-500">
                {{ view.description }}
            </p>

            <p v-if="view.details" class="mt-3 text-center text-xs leading-5 text-slate-500">
                {{ view.details }}
            </p>

            <Button class="mt-6 w-full" :variant="view.buttonVariant" @click="handleNavigate">
                {{ view.buttonText }}
            </Button>
        </div>
    </div>
</template>

<style scoped></style>
