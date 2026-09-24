<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineOptions({ name: 'PopupType4' })

const emit = defineEmits(['close-action', 'click-action'])
function onClose() { emit('close-action') }
function onClick() { emit('click-action') }
</script>

<template>
    <div
        class="relative flex flex-col gap-4 items-center text-black bg-white p-7 w-lg inset-0 rounded-md shadow-lg border border-gray-300 mx-auto my-auto font-display">
        <div class="absolute text-ternary/30 top-2 right-2 cursor-pointer" @click="onClose"><X class="size-5" /></div>
        <p class="text-2xl font-bold">Apple iPhone 18</p>
        <img src="https://www.pngmart.com/files/24/iPhone-17-PNG-Isolated-Image.png" class="w-30" alt="">
        <p class="font-semibold">{{ new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day:
                'numeric'
        }) }}</p>


        <div class="text-center text-sm">
            <p>Congratulations Apple user!</p>
            <p>
                National Consumer Center would like to thank you for your
                loyalty.
            </p>
        </div>
        <p class="text-sm">Spin the wheel to claim your special prize</p>

        <p class="font-bold">Good Luck!</p>

        <button
            class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300" @click="onClick">
            Claim
        </button>
    </div>
</template>