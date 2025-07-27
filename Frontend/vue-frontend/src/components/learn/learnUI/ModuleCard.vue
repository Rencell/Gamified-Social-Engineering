<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import book from '/Learning/book.png'
import { ArrowRight, Circle, CircleCheck, Play } from 'lucide-vue-next';
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
    }
});
</script>

<template>


    <div class="flex gap-3 group">


        <div class="grow my-2 p-3 flex items-center rounded-xl bg-secondary gap-6">
            <div class="flex items-center justify-center pl-5">
                
                <img :src="book" alt="">
            </div>
            
            <div class="grow gap-3 space-y-3 flex justify-between items-center pr-5">
                <div class="font-semibold text-sm space-y-3">
                    <p class="uppercase text-xs font-bold text-slate-600">Lesson {{lessonkey}}</p>
                    <p>{{ title }}</p>
                </div>
                <div class="flex items-center gap-3">
                    <Button asChild variant="ghost" size="lg" class="font-semibold border-1 border-accent/60">
                        <RouterLink :to="routerLink">
                            <Play :size="18" fill="white" ></Play>
                            <p class="font-bold">Learn</p> 
                        </RouterLink>
                        
                    </Button>
                    <Circle class="text-slate-600"  v-if="!interactive" />
                    <CircleCheck v-else class="text-green-400" fill="green" />
                </div>
            </div>


        </div>
    </div>



</template>