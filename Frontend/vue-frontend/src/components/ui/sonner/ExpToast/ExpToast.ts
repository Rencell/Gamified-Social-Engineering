import { h } from 'vue'
import { toast } from 'vue-sonner'
import ExpToast from './ExpToast.vue'


const DURATION = 5000;

export function showExpToast(){

    toast.custom(
        () => 
            h(ExpToast,{progressDuration: DURATION}),
        {
            id: 'exp-toast',
            duration: DURATION,
            position: 'bottom-right',
        }

    )
}
