<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps<{
    number: string;
    date: string;
    message: string;
}>();

const emit = defineEmits<{
    'update:number': [value: string];
    'update:date': [value: string];
    'update:message': [value: string];
}>();

// Create individual computed properties with setters
const number = computed({
    get: () => props.number,
    set: (value: string) => emit('update:number', value)
});

const date = computed({
    get: () => props.date,
    set: (value: string) => emit('update:date', value)
});

const Message = computed({
    get: () => props.message,
    set: (value: string) => emit('update:message', value)
});


</script>

<template>
    <div class="w-90 h-[80dvh] rounded-3xl bg-black  p-3 motion-preset-fade">

        <div class="w-full h-full rounded-2xl bg-white space-y-4 text-black p-4 font-display">
            <div class="flex items-center gap-2 font-semibold">
                <Phone class="text-blue-600"></Phone>
                
                <Input v-model="number" placeholder="Enter phone number"></Input>
            </div>

            <hr class="border-t border-gray-300" />

            <div class="text-center font-semibold text-ternary">
                <Input v-model="date" placeholder="Enter phone number"></Input>
                
            </div>

            <div class="w-60 p-4 bg-blue-500 rounded-xl text-white">
                <Textarea v-model="Message" placeholder="Enter message"></Textarea>
            </div>
        </div>
    </div>
</template>