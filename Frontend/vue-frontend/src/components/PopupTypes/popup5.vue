<script setup lang="ts">
import { Bell } from 'lucide-vue-next';

defineOptions({ name: 'PopupType5' })

const emit = defineEmits(['close-action', 'click-action'])

function onClose() {
  emit('close-action')
}

function onClick() {
  emit('click-action')
}

</script>

<template>
    <div
        class="relative text-black bg-white p-7 w-xs inset-0 rounded-md shadow-lg border border-gray-300 mx-auto my-auto font-display space-y-4">

        <div class="text-sm">http://localhost:5173/home</div>
        <div class="flex gap-3"><Bell class="fill-current text-ternary"></Bell> Show notifications</div>
        <div class="flex justify-end gap-2">
            <button
                class="px-4 py-2 bg-primary text-blue-600 border-2 border-ternary/20 font-semibold rounded-md shadow-md text-sm" @click="onClick">
                Allow
            </button>
            <button
                class="px-4 py-2 bg-primary text-blue-600 border-2 border-ternary/20 font-semibold rounded-md shadow-md text-sm" @click="onClose">
                Block
            </button>
        </div>
    </div>
</template>