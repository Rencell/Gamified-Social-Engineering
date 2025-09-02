<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { CircleUserRound } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>

<template>
    <div class="flex flex-col items-center gap-10 h-screen">
        <p class="text-3xl font-bold">Profile</p>
        <CircleUserRound class="text-ternary" :size="100"/>
        <p class="text-ternary font-semibold">{{ authStore.User.email }}</p>
        <RouterLink :to="{ name: 'logout' }" class="w-full">
            <Button variant="secondary" class="w-full text-red-500">Logout</Button>
        </RouterLink>
    </div>

</template>