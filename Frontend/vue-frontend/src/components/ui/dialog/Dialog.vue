<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from "reka-ui";
import { DialogRoot, useForwardPropsEmits } from "reka-ui";
import { useAuthStore } from "@/stores/auth";

const props = defineProps<DialogRootProps & {
  showForUser?: boolean; // New prop to control visibility for users
}>();
const emits = defineEmits<DialogRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
const authStore = useAuthStore();
</script>

<template>
  <DialogRoot
    v-if="showForUser || authStore.User.is_admin"
    data-slot="dialog"
    v-bind="forwarded"
  >
    <slot />
  </DialogRoot>
</template>
