<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { CircleUserRound } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { ThemeToggle } from '@/components/ui/theme-toggle';
const authStore = useAuthStore();
</script>

<template>
    <ThemeToggle class="absolute left-5 p-2 rounded-xl bg-accent text-white"></ThemeToggle> 
    <div class="flex flex-col items-center gap-10 h-screen">
        <p class="text-3xl font-bold">Profile</p>
        <CircleUserRound class="text-ternary" :size="100"/>
        <p class="text-ternary font-semibold">{{ authStore.User.email }}</p>
        <RouterLink :to="{ name: 'logout' }" class="w-full">
            <Button variant="secondary" class="w-full text-red-500">Logout</Button>
        </RouterLink>
       
    </div>

</template>