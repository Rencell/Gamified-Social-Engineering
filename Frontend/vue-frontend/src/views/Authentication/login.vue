<script setup lang="ts">
import { Button } from "@/components/ui/button";
import LoginWithGoogle from '@/components/AuthSocial/loginWithGoogle.vue'

defineOptions({
  name: 'AuthLoginView',
})

const apiBase = import.meta.env.VITE_API_BASE as string | undefined

function goToAdmin() {
  // Redirect to Django admin (typically /admin/)
  const base = (apiBase ?? '').replace(/\/$/, '')
  const url = base ? `${base}/admin/` : '/admin/'
  window.location.href = url
}
</script>

<template>
  <div class="w-full max-w-md space-y-6 flex flex-col justify-between h-full py-15">
    
    <div class="w-full max-w-md space-y-8">
      <div class="space-y-3 text-center font-display">
        <h2 class="text-3xl font-bold">Welcome Back</h2>
        <p class="text-slate-400 font-semibold text-sm">Sign in to your account</p>
      </div>

      <div>
        
        <LoginWithGoogle class="w-full" />
      </div>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-700"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-background px-2 font-bold">Or continue with</span>
        </div>
      </div>

      <div>
        <Button
          variant="outline"
          size="lg"
          class="w-full bg-white hover:bg-gray-50 border-slate-300 font-semibold"
          @click="goToAdmin"
        >
          Continue with admin
        </Button>
      </div>

      
    </div>
    
    <p class="text-xs text-slate-400 text-center">
      By continuing, you agree to our
      <a href="#" class="font-bold hover:underline">
        Terms of Service
      </a>
      and
      <a href="#" class="font-bold hover:underline">
        Privacy Policy
      </a>
    </p>
    <!-- <Button @click="authStore.loginWithGoogle()" class="w-full font-bold" size="lg">
       Click Google
    </Button> -->
    
  </div>

</template>
