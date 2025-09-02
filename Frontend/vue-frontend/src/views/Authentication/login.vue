<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";

import { useRoute, useRouter } from "vue-router";
import LoginWithGoogle from '@/components/AuthSocial/loginWithGoogle.vue'

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const step = ref(1);

const form = reactive({
    email: '',
    password: '',
});

const nextStep = () => {
    step.value = 2;
};
const previousStep = () => {
    step.value = 1;
};

const loading = ref(false);
const login = async (): Promise<void> => {
    loading.value = true;
    try {
        await authStore.login(form, router, route);
    } catch (error) {
        // handle error (e.g., show notification)
        console.error(error);
    } finally {
        loading.value = false;
    }
};



</script>

<template>
    <div class="w-full max-w-md space-y-6 flex flex-col justify-between h-full py-15">
       
        

        <div class="w-full max-w-md space-y-8">
            <div class="space-y-3 text-center font-display">
                <h2 class="text-3xl font-bold text-white">Welcome Back</h2>
                <p class="text-slate-400 font-semibold text-sm">Sign in to your account</p>
            </div>

            <div >
                <LoginWithGoogle class="w-full" />
            </div>

            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-700"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="bg-background px-2 text-white font-bold">Or continue with</span>
                </div>
            </div>

            <div>
                <Button variant="outline" size="lg" class="w-full bg-white hover:bg-gray-50 text-white border-gray-300">
                    Apple
                </Button>
            </div>

            
        </div>
        
        <p class="text-xs text-slate-400 text-center">
            By continuing, you agree to our
            <a href="#" class="text-white hover:underline">
                Terms of Service
            </a>
            and
            <a href="#" class="text-white hover:underline">
                Privacy Policy
            </a>
        </p>
        <!-- <Button @click="authStore.loginWithGoogle()" class="w-full font-bold" size="lg">
           Click Google
        </Button> -->
        
    </div>

</template>
