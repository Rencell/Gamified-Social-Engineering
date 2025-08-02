<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reactive, ref } from "vue";
import { AuthService } from "@/services";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
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
const errors = ref<string[]>([]);

const submit = async (): Promise<void> => {
  loading.value = true;
  try {
    const response = await authStore.registration(form);
    errors.value = [];
    clearForm(); 
    emit('switchComponent', 'inbox');
  } catch (error: any) {
    console.error('Registration failed:', error?.response?.data);
    errors.value = error?.response?.data || ['Registration failed'];
  } finally {
    loading.value = false;
  }
};
</script>

<template>
    <div class="w-full max-w-md space-y-6 flex flex-col justify-between h-full ">
        <div class="w-full max-w-md space-y-6">
            <div class="space-y-2">
                <h2 class="text-2xl font-bold text-white">Get Started</h2>
                <p class="text-slate-400 font-semibold text-sm">Sign in or create a new account</p>
            </div>

            <div class="space-y-5">
                <div class="space-y-2">
                    <Label for="username" class="text-white font-bold text-xs">
                        Username
                    </Label>
                    <Input v-model="form.username" id="username" type="text" placeholder="username"
                        class="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div class="space-y-2">
                    <Label for="email" class="text-white font-bold text-xs">
                        Email
                    </Label>
                    <Input v-model="form.email" id="email" type="email" placeholder="email@example.com"
                        class="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div class="space-y-2">
                    <Label for="password" class="text-white font-bold text-xs">
                        Password
                    </Label>
                    <Input v-model="form.password1" id="password" type="password" placeholder="Enter your password"
                        class="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div class="space-y-2">
                    <Label for="password2" class="text-white font-bold text-xs">
                        Confirm Password
                    </Label>
                    <Input v-model="form.password2" id="password" type="password" placeholder="Confirm your password"
                        class="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </div>

                <Button @click="submit()" class="w-full font-bold" size="lg">
                    <Spinner v-if="loading" variant="white" size="sm"></Spinner>
                    Continue
                </Button>
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