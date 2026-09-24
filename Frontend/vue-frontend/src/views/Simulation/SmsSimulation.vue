<script setup lang="ts">
import User from './sms-simulation/user.vue';
import { useAuthStore } from '@/stores/auth';
import Admin from './sms-simulation/admin.vue'

const authStore = useAuthStore();
</script>

<template>
    <User v-if="!authStore.User.is_admin" />
    <Admin v-else />
</template>