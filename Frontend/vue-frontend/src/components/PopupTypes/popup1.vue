<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { Button } from '../ui/button';

defineOptions({ name: 'PopupType1' })

const emit = defineEmits(['close-action', 'click-action'])

function onClose() {
  emit('close-action')
}

function onClick() {
  emit('click-action')
}
</script>

<template>
    <div class="relative bg-white p-7 w-lg inset-0 space-y-7 rounded-md shadow-lg border border-gray-300 mx-auto my-auto">
        <div class="absolute text-ternary/30 top-2 right-2 cursor-pointer" @click="onClose"><X class="size-5"></X></div>
        <p class="text-red-600 font-semibold">3 viruses and 12 malware files have been detected on your PC. Please take
            action to secure your system.</p>

        <div class="space-y-2 text-background font-medium text-sm font-display">
            <p>Steps to Clean Your PC in Just a Few Minutes:</p>
            <div>
                <p>Step 1. Click CLEAN to redirect to the antivirus page.</p>
                <p>Step 2. Complete the secure payment form to activate your antivirus subscription immediately,</p>
                <p>Step 3. Clean your PC.</p>
            </div>
            <p>
                You can clean your PC with a personalized discount within 2 minutes
                49 seconds. For more information, visit our website.
            </p>
        </div>

        <div class="flex justify-end">
            <Button class="bg-green-500" @click="onClick">Clean</Button>
        </div>

    </div>
</template>