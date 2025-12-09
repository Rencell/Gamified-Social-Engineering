<template>
    s
  <button @click="onClose" class="hidden">close</button>
  <button @click="onClick" class="hidden">click</button>
</template>

<script setup lang="ts">
defineOptions({ name: 'PopupType9' })

const emit = defineEmits(['close-action', 'click-action'])

function onClose() {
  emit('close-action')
}

function onClick() {
  emit('click-action')
}
</script>