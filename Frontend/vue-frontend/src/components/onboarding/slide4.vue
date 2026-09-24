<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { Checkbox } from '../ui/checkbox'
import { ref } from 'vue'
import DialogSimulation from '../simulation/dialogSimulation.vue'
import DialogConsent from '../simulation/onboarding/dialogConsent.vue'
import PhoneInput from './PhoneInput.vue'
import { SimulationService } from '@/services'


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
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-7 px-6 py-12 text-center motion-preset-fade ">
    <!-- Avatar Grid -->
    <div class="mb-8 flex justify-center w-sm">
        <img src="/Guides/Sms.webp" alt="">
    </div>

    <!-- Content -->
    <div class="max-w-2xl space-y-6 w-md mb-8">
      <h1 class="text-2xl font-bold leading-tight text-foreground md:text-3xl font-display">
        How about SMS Phishing simulations?
      </h1>
      <div class="flex justify-center items-center">
        <Checkbox v-model="checked" />
        <DialogConsent />
      </div>
      <div v-show="checked" class="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
        <PhoneInput v-model="phoneNumber" @phone-valid="al" placeholder="Enter your phone number" />
      </div>
    </div>
    
    <!-- Navigation -->
    <div class=" grid grid-cols-2 gap-3 w-full max-w-md">
        <Button 
            :disabled="buttonDisabled" 
            variant="secondary" size="lg" 
            @click="goToFinalSlide()">
            Continue
        </Button>
        <Button size="lg" @click="goToFinalSlide()">
            No, thanks
        </Button>
    </div>
  </div>
</template>

