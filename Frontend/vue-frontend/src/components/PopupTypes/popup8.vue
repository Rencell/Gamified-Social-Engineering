<template>
    <div class="w-80 bg-gray-800 text-white rounded-lg shadow-xl p-4 font-display m-5">
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.png" class="w-5 h-5" alt="Chrome" />
                <span class="text-sm font-medium">Google Chrome</span>
            </div>

            <button @click="onClose" class="text-gray-400 hover:text-gray-200 text-xl leading-none">
                ✕
            </button>
        </div>

        <!-- Content -->
        <div class="flex gap-3">
            <!-- Warning Icon -->
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.png" class="w-10 h-10" alt="Warning" />

            <div class="flex-1">
                <div class="font-semibold text-base leading-tight">
                    Someone is spying from your computer!
                </div>

                <div class="text-sm text-gray-300 mt-1">
                    Is it you?
                </div>

                <div class="text-xs text-gray-400 mt-1">
                    https://bit.ly/3xYzAbc
                </div>
            </div>
        </div>

        <!-- Buttons -->
        <div class="mt-4 flex gap-3">
            <button class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-center" @click="onClick">
                Call for help
            </button>
            <button class="py-2 px-3 bg-gray-700 hover:bg-gray-600" @click="onClose">Close</button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'PopupType8' })

const emit = defineEmits(['close-action', 'click-action'])

function onClose() {
  emit('close-action')
}

function onClick() {
  emit('click-action')
}
</script>