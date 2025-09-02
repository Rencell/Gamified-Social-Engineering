<script setup lang="ts">
import { Phone } from 'lucide-vue-next';

defineProps<{
    number: string;
    date: string;
    message: string;
}>();
</script>

<template>
    <div class="w-90 h-[80dvh] rounded-3xl bg-black  p-3 motion-preset-fade">

        <div class="w-full h-full rounded-2xl bg-white space-y-4 text-black p-4 font-display">
            <div class="flex items-center gap-2 font-semibold">
                <Phone class="text-blue-600"></Phone>
                <span>{{number}}</span>
            </div>

            <hr class="border-t border-gray-300" />

            <div class="text-center font-semibold text-ternary">
                {{date}}
            </div>

            <div class="w-60 p-4 bg-blue-500 rounded-xl text-white">
                {{message}}
            </div>
        </div>
    </div>
</template>