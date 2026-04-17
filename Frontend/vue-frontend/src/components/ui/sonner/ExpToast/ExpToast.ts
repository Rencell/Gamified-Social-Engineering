import { h } from 'vue'
import { toast } from 'vue-sonner'
import ExpToast from './ExpToast.vue'
import { SimulationTopic } from './expToastTypes';

const DURATION = 5000;


export function showExpToast(topic: SimulationTopic = SimulationTopic.Vishing){

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
