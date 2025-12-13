<script setup lang="ts">
import User from './safe-browsing/user.vue';
import Admin from './safe-browsing/admin.vue';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>

<template>
    <User v-if="!authStore.User.is_admin" />
    <Admin v-else />
</template>