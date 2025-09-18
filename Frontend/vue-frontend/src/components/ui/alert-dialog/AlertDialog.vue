<script setup lang="ts">
import type { AlertDialogEmits, AlertDialogProps } from "reka-ui"
import { AlertDialogRoot, useForwardPropsEmits } from "reka-ui"
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const props = defineProps<AlertDialogProps>()
const emits = defineEmits<AlertDialogEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <AlertDialogRoot v-if="authStore.User.is_admin" data-slot="alert-dialog" v-bind="forwarded">
    <slot />
  </AlertDialogRoot>
</template>
