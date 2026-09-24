<template>
    <div class="flex items-center justify-center">

        <div class="w-2xl flex flex-col items-center justify-center space-y-6 p-8">
            <div class="w-30"><img :src="email" class="w-full" alt=""></div>
            <p class="font-bold text-xl">Oops... Page not found</p>

            <p class="text-slate-400 text-sm text-center font-medium">
                Seems like the link you followed is broken or the page has been removed.
            </p>

            <RouterLink :to="{name : 'Home'}">
                <Button>
                    <ChevronLeft></ChevronLeft>Back
                </Button>
            </RouterLink>
        </div>

    </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import email from '/ErrorPage/link_broken.svg';
import { AuthService, LessonService } from '@/services';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home } from 'lucide-vue-next';
const authStore = useAuthStore();
const route = useRoute();

const key = route.params.key as string;


onMounted(async () => {
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