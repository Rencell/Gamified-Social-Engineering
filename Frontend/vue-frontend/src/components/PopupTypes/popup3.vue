<script setup lang="ts">
import { Download, X } from 'lucide-vue-next';

defineOptions({ name: 'PopupType3' })

const emit = defineEmits(['close-action', 'click-action'])

function onClose() {
  emit('close-action')
}

function onClick() {
  emit('click-action')
}

</script>

<template>
    <div class="relative rounded-lg flex gap-2 w-sm items-center p-4 bg-secondary m-4 motion-preset-slide-down ">
        <div class="absolute text-ternary/30 top-2 right-2 cursor-pointer" @click="onClose"><X class="size-5"></X></div>
        <Download class="text-blue-500 size-10"></Download>
        <div>
            Download File?
            <p class="text-xs">Anyone using this device can see
                downloaded files</p>
        </div>

        <button class="text-blue-300 font-semibold" @click="onClick">Download</button>
    </div>
</template>