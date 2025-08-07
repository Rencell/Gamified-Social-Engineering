<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { reactive, ref } from "vue";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/auth";
import Attributes from '@/components/authentication/FormInput.vue'
const authStore = useAuthStore();

interface SignupForm {
    username: string;
    email: string;
    password1: string;
    password2: string;
}

const clearForm = () => {
    form.username = '';
    form.email = '';
    form.password1 = '';
    form.password2 = '';
};

const form = reactive<SignupForm>({
    username: '',
    email: '',
    password1: '',
    password2: '',
});

const emit = defineEmits(['switchComponent']);
const loading = ref(false);
const errors = reactive({
    username: '',
    email: '',
    password1: '',
    password2: '',
    server: ''
});


const validateForm = () => {
    errors.username = !form.username ? 'Username is required' : '';
    errors.email = !form.email ? 'Email is required' : '';
    errors.password1 = !form.password1 ? 'Password is required' : '';
    errors.password2 = !form.password2 ? 'Confirm Password is required' : '';

    if (form.password1 && form.password2 && form.password1 !== form.password2) {
        errors.password2 = 'Passwords do not match';
    }

    return !errors.username && !errors.email && !errors.password1 && !errors.password2;
}

const submit = async (): Promise<void> => {
    if (!validateForm()) {
        return;
    }

    loading.value = true;
    try {
        await authStore.registration(form);
        Object.keys(errors).forEach(key => errors[key] = '');
        clearForm();
        emit('switchComponent', 'inbox');
    } catch (error: any) {
        console.error('Registration failed:', error?.response?.data);
        errors.server = error?.response?.data?.message || 'Registration failed';
    } finally {
        loading.value = false;
    }
};

const clear = (value: keyof typeof errors) => {
    errors[value] = '';
}
</script>

<template>
    <div class="w-full max-w-md space-y-6 flex flex-col justify-between h-full ">
        <div class="w-full max-w-md space-y-6">
            <div class="space-y-2">
                <h2 class="text-2xl font-bold text-white">Get Started</h2>
                <p class="text-slate-400 font-semibold text-sm">Sign in or create a new account</p>
            </div>

            <div class="space-y-5">
                <Attributes v-model="form.username" id="Username" type="text" :error="errors.username" @clear="clear('username')" />
                <Attributes v-model="form.email" id="Email Adress" type="email" :error="errors.email" @clear="clear('email')" />
                <Attributes v-model="form.password1" id="Password" type="password" :error="errors.password1" @clear="clear('password1')"/>
                <Attributes v-model="form.password2" id="Confim Password" type="password" :error="errors.password2" @clear="clear('password2')" />


                <Button @click="submit()" class="w-full font-bold" size="lg">
                    <Spinner v-if="loading" variant="white" size="sm"></Spinner>
                    Continue
                </Button>

                <p class="text-xs font-bold">
                    Already have an account?
                    <a href="/login" class="text-blue-400 underline hover:text-blue-600 font-bold ml-1">
                        Here
                    </a>
                </p>
            </div>

            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-700"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="bg-background px-2 text-white font-bold">Or continue with</span>
                </div>
            </div>

            <div class="space-y-3">
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