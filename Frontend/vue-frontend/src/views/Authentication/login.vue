<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-vue-next";
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";

import { useRoute, useRouter } from "vue-router";
import { Spinner } from "@/components/ui/spinner";

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
    <div class="w-full max-w-md space-y-6 flex flex-col justify-between h-full py-10">
        <div v-if="step == 2" class="absolute top-3 left-3 w-8 h-8 flex items-center justify-center cursor-pointer"
            @click="previousStep">
            <ChevronLeft></ChevronLeft>
        </div>

        <div class="w-full max-w-md space-y-6 ">
            <div class="space-y-2">
                <h2 class="text-2xl font-bold text-white">Welcome Back</h2>
                <p v-if="step == 1" class="text-slate-400 font-semibold text-sm">Sign in to your account</p>
                <p v-if="step == 2" class="text-slate-400 font-semibold text-sm">Enter your password</p>
            </div>

            <div class="space-y-7">
                <div v-if="step === 1" class="space-y-2">
                    <Label for="email" class="text-white font-bold text-xs">
                        Email
                    </Label>
                    <Input v-model="form.email" id="email" type="email" placeholder="email@example.com"
                        class="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        @keydown.enter="nextStep" @keyup.enter="nextStep" />
                </div>

                <div v-if="step === 2" class="space-y-2">
                    <Label for="password" class="text-white font-bold text-xs">
                        Password
                    </Label>
                    <Input v-model="form.password" id="password" type="password" placeholder="Enter your password"
                        class="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        @keydown.enter="login" @keyup.enter="login" />
                </div>

                <Button v-if="step === 1" @click="nextStep()" class="w-full font-bold" size="lg">

                    Continue
                </Button>
                <Button v-if="step === 2" @click="login()" class="w-full font-bold" size="lg">
                    <Spinner v-if="loading" variant="white"></Spinner>Login
                </Button>
                <div v-if="step === 2"
                    class="text-sm text-center underline font-bold text-slate-400 hover:text-blue-400 transition-all cursor-pointer">
                    Forgot your password?

                </div>
            </div>

            <div v-if="step === 1" class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-700"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="bg-background px-2 text-white font-bold">Or continue with</span>
                </div>
            </div>

            <div v-if="step === 1" class="space-y-3">
                <Button variant="outline" size="lg" class="w-full bg-white hover:bg-gray-50 text-white border-gray-300">
                    Apple
                </Button>
                <Button variant="outline" size="lg" class="w-full bg-white hover:bg-gray-50 text-white border-gray-300">
                    Google
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
    </div>
</template>
