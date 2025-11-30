<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { Checkbox } from '../ui/checkbox'
import { ref } from 'vue'
import DialogSimulation from '../simulation/dialogSimulation.vue'
import DialogConsent from '../simulation/onboarding/dialogConsent.vue'
import { SimulationService } from '@/services'
import { set } from '@vueuse/core'
import { Spinner } from '../ui/spinner'


const emit = defineEmits(['next', 'prev'])

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
  
  toggleConsent();

  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    if (isConsent) {
      router.push('/onboarding/sms-simulation')
    } else {
      router.push('/onboarding/sms-simulation')
    }
  }, 2000);
}

const checked = ref(false);
const toggleCheckbox = () => {
  checked.value = !checked.value;
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-7 px-6 py-12 text-center motion-preset-fade ">
    <!-- Avatar Grid -->
    <div class="mb-8 flex justify-center w-sm">
        <img src="/Guides/email.webp" alt="">
    </div>

    <!-- Content -->
    <div class="max-w-2xl space-y-6 w-md mb-8">
      <h1 class="text-2xl font-bold leading-tight text-foreground md:text-3xl font-display">
        Do you want to participate in Email Phishing simulations?
      </h1>

      <div class="flex justify-center items-center"><Checkbox v-model="checked"></Checkbox><DialogConsent /></div>
    </div>

    <!-- Navigation -->
    <div class=" grid grid-cols-2 gap-3 w-full max-w-md">

        <Button 
            :disabled="!checked" 
            variant="secondary" size="lg" 
            @click="goToSmsSimulationConsent(true)">
            <Spinner v-if="loading" :size="'sm'"></Spinner>
            Continue
        </Button>
        <Button size="lg" @click="goToSmsSimulationConsent(false)">
            No, thanks
        </Button>
    </div>
  </div>
</template>