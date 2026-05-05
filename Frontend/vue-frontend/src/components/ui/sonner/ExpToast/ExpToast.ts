import { h } from 'vue'
import { toast } from 'vue-sonner'
import ExpToast from './ExpToast.vue'
import { SimulationTopic } from './expToastTypes';
import { playSoundFx, SoundFx } from '@/composables/useSoundFx';

const DURATION = 5000;


export function showExpToast(topic: SimulationTopic = SimulationTopic.Vishing){

    playSoundFx(SoundFx.NewExp);
    toast.custom(
        () => 
            h(ExpToast, { progressDuration: DURATION, topic }),
        {
            id: 'exp-toast',
            duration: DURATION,
            position: 'bottom-right',
        }

    )
}
