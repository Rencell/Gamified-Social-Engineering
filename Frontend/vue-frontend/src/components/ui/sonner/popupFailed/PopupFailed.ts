import { h } from 'vue'
import { toast } from 'vue-sonner'
import PopupFailed from './PopupFailed.vue'
import { playSoundFx, SoundFx } from '@/composables/useSoundFx';

export type PopupFailedOptions = {
    title?: string
    topic?: string
    primaryLine?: string
    secondaryLine?: string
    avoidCta?: string
    progress?: number
    onAvoid?: () => void
}

export function showPopupFailed(options: PopupFailedOptions = {}) {

    playSoundFx(SoundFx.failure);
    toast.custom(
        () =>
            h(PopupFailed, {
                ...options,
                onClose: () => toast.dismiss('failed-popup-toast'),
                onAvoid: () => {
                    options.onAvoid?.()
                    toast.dismiss('failed-popup-toast')
                },
            }),

        {
            id: 'failed-popup-toast',
            position: 'bottom-right',
            duration: 10_000,
        }

    )
}
