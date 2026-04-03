<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { Checkbox } from '../ui/checkbox'
import { ref } from 'vue'
import DialogConsent from '../simulation/onboarding/dialogConsent.vue'
import { SimulationService } from '@/services'
import { Spinner } from '../ui/spinner'
import { ThemeToggle } from '../ui/theme-toggle'


const router = useRouter()

const toggleConsent = (async () => {
    try {
        await SimulationService.update_email_consent(true);
    } catch (error) {
        console.error('Error updating consent:', error);
    }
});
const loading = ref(false);
const goToSmsSimulationConsent = (isConsent: boolean) => {
  
  
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    if (isConsent) {
      toggleConsent();
      router.push('/onboarding/sms-simulation')
    } else {
      router.push('/onboarding/sms-simulation')
    }
  }, 2000);
}

const checked = ref(false);

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
        src="/Guides/email.webp"
        alt=""
        class="h-auto w-full max-w-xs object-contain sm:max-w-sm"
      >
    </div>

    <!-- Content -->
    <div class="mb-6 w-full max-w-2xl space-y-5 sm:mb-8 sm:space-y-6">
      <h1 class="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
        Do you want to participate in Email Phishing simulations?
      </h1>

      <div class="flex items-center justify-center gap-2">
        <Checkbox v-model="checked"></Checkbox>
        <DialogConsent />
      </div>
    </div>

    <!-- Navigation -->
    <div class="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
      <Button :disabled="!checked" variant="secondary" size="lg" @click="goToSmsSimulationConsent(true)">
        <Spinner v-if="loading" :size="'sm'"></Spinner>
        Continue
      </Button>
      <Button size="lg" @click="goToSmsSimulationConsent(false)"> No, thanks </Button>
    </div>
  </div>
</template>