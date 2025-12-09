<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { Button } from '../ui/button';

// add emits for close and click actions
const emit = defineEmits(['close-action', 'click-action']);

function onClose() {
  emit('close-action');
}

function onClick() {
  emit('click-action');
}

defineOptions({ name: 'PopupType2' })
</script>

<template>
    <div class="relative bg-[#2166b3] p-7 w-2xl
     inset-0 space-y-7 text-white font-display">
        <div class="absolute text-ternary/30 top-2 right-2 cursor-pointer" @click="onClose">
            <X class="size-5"></X>
        </div>
        <p class="font-semibold text-2xl">WARNING!</p>

        <div class="space-y-5 font-medium">
            <p>
                Your Windows 10 is infected with Viruses and other malicious applications. Viruses must be
                removed and system damage repaired.
            </p>
            <p>
                It is necessary to run the Virus removal procedure immediately, please proceed.
            </p>
            <p>
                **lf you leave this site your computer will remain damaged and vulnerable**
            </p>
        </div>

        <div class="flex justify-end items-center">
            <Button variant="link" @click="onClose">Deny</Button>
            <button class="border-2 border-primary p-3 px-7 cursor-pointer hover:bg-black/20" @click="onClick">Renew License</button>
        </div>

    </div>
</template>