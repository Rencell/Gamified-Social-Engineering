<template>
    <div class="flex items-center justify-center">

        <div class="w-2xl flex flex-col items-center justify-center space-y-6 p-8">
            <img :src="email" alt="">
            <p class="font-bold text-xl">Thanks For Signing Up!</p>
    
            <p class="text-slate-400 text-sm text-center font-medium">
                We've sent a magic link to 475eastern@edny.net. Click on the link in the email to continue the setup of your
                account.
            </p>
    
            <svg class="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
    
            <p class="text-sm text-center font-bold">
                Will now redirect you to Home Page
            </p>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import email from '/Authentication/email.svg';
import { AuthService, LessonService } from '@/services';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const route = useRoute();

const key = route.params.key as string;


onMounted(async() => {
    try {
        await AuthService.confirm_email(key);
        setTimeout(() => {
            window.location.href = '/home';
        }, 3000);
    } catch (error) {
        console.error('Error confirming email:', error);
    }
});

</script>