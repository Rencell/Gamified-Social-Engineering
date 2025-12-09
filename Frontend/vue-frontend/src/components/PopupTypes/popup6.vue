<script setup lang="ts">
import { X } from 'lucide-vue-next';

defineOptions({ name: 'PopupType6' })

const emit = defineEmits(['close-action', 'click-action'])

function onClose() { emit('close-action') }
function onClick() { emit('click-action') }
</script>

<template>
    <div class="relative text-black bg-white w-lg inset-0 shadow-lg mx-auto my-auto font-display">
        <div class="absolute text-ternary/30 top-2 right-2 cursor-pointer" @click="onClose"><X class="size-5"></X></div>
        <div class="bg-red-600 text-center p-4 text-white text-xl font-semibold">
            <p>Security Alert</p>
            <p>You've visited a illegal infected website</p>
        </div>

        <div class="p-6 space-y-4 text-sm text-center">
            <p>You have visited unsafe site with illegal content</p>
            <p>Your PC is at risk of being infected by viruses</p>
            <p>To continue browsing safely • perform an antivirus scan</p>
        </div>

        <div class="bg-ternary/20 border-t-2 border-ternary/50 p-4 text-center text-sm flex justify-end">
            <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-14 rounded" @click="onClick">
                Scan
            </button>
        </div>
    </div>

</template>