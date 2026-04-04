<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { Checkbox } from '../ui/checkbox'
import { ref } from 'vue'
import DialogConsent from '../simulation/onboarding/dialogConsent.vue'
import PhoneInput from './PhoneInput.vue'
import { SimulationService } from '@/services'
import { ThemeToggle } from '../ui/theme-toggle'


const router = useRouter()

const loading = ref(false);
const goToFinalSlide = () => {

  if(phoneNumber.value && checked.value){
    toggleConsent();
  }

  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    router.push('/home')
  }, 2000);
}


const checked = ref(false);
const phoneNumber = ref('');

const buttonDisabled = ref(true);
const al = () => {
  buttonDisabled.value = false;
}

const toggleConsent = async () => {
    try {
        await SimulationService.update_phone_consent(phoneNumber.value);
    } catch (error) {
        console.error('Error updating consent:', error);
    }
};

// Theme toggle is handled by <ThemeToggle />
const THEME_STORAGE_KEY = 'theme'
</script>

<template>
  <div
    class="flex min-h-[100svh] flex-col items-center justify-center gap-6 px-4 py-8 text-center motion-preset-fade sm:gap-7 sm:px-6 sm:py-12"
  >
  <ThemeToggle
    class="h-9 w-9 absolute top-4 right-4 sm:top-6 sm:right-6"
    :storage-key="THEME_STORAGE_KEY"
  />
    <!-- Avatar Grid -->
    <div class="mb-4 flex w-full justify-center sm:mb-8">
      <img
        src="/Guides/Sms.webp"
        alt=""
        class="h-auto w-full max-w-xs object-contain sm:max-w-sm"
      >
    </div>

    <!-- Content -->
    <div class="mb-6 w-full max-w-2xl space-y-5 sm:mb-8 sm:space-y-6">
      <h1 class="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
        How about SMS Phishing simulations?
      </h1>
      <div class="flex items-center justify-center gap-2">
        <Checkbox v-model="checked" />
        <DialogConsent />
      </div>
      <div v-show="checked" class="mb-4 animate-in fade-in slide-in-from-top-2 duration-300 sm:mb-6">
        <PhoneInput v-model="phoneNumber" @phone-valid="al" placeholder="Enter your phone number" />
      </div>
    </div>

    <!-- Navigation -->
    <div class="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
      <Button :disabled="buttonDisabled" variant="secondary" size="lg" @click="goToFinalSlide()">
        Continue
      </Button>
      <Button size="lg" @click="goToFinalSlide()"> No, thanks </Button>
    </div>
  </div>
</template>

