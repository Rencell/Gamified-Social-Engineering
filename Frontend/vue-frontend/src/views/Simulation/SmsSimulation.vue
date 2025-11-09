<script setup lang="ts">
import { Card } from '@/components/ui/card';
import RiskIndicator from '@/components/simulation/riskIndicator.vue'
import { SimulationService } from '@/services';
import { computed, onMounted, ref } from 'vue';
import type { GoPhish } from '@/services/simulationService';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShieldAlert } from 'lucide-vue-next';
import DialogSimulation from '@/components/simulation/dialogSimulation.vue'
const phishingData = ref<GoPhish[]>([])
const isOpen = ref(false);
function toggleDialog() {
    isOpen.value = !isOpen.value;
    // toggleshit();
}
// onMounted(async () => {
//     // Fetch simulation data when the component is mounted
//     try {
//         const response = await SimulationService.get_all();
//         const consent = await SimulationService.get_consent();
//         isOpen.value = consent.email_consent;
//         phishingData.value = response;
//     } catch (error) {
//         console.error('Error fetching simulation data:', error);
//     }
// });

// const security_score = computed(() => {
//     if (phishingData.value.length > 0) {
//         return phishingData.value[0].security_score;
//     }
//     return 0; // Default score if data is not available
// });

// const toggleshit = (async () => {
//     try {
//         await SimulationService.update_email_consent(true);
//     } catch (error) {
//         console.error('Error updating consent:', error);
//     }
// });

</script>

<template>
<!--     
    <Button @click="toggleshit">Toggle Dialog></Button> -->
    <div class="mx-auto max-w-7xl space-y-12 font-display"
        :class="{ 'blur-md brightness-50': !isOpen }">
        <section>
            <h1 class="mb-8 text-4xl font-bold text-white">Security Risk Score</h1>
            <Card class="border-[#1a2332] bg-secondary p-8 rounded-2xl">
                <div class="mb-6 flex items-baseline gap-4">
                    <div class="text-5xl font-bold text-white">{{ security_score }}</div>
                    <div class="text-lg text-gray-400">Security Risk Score</div>
                </div>
                
                <RiskIndicator :score="security_score" :max-score="100" risk-level="low" />
                
                <p class="mt-6 text-sm leading-relaxed text-gray-400">{description}</p>
            </Card>
        </section>
        
        
        <section>
            <h2 class="mb-8 text-3xl font-bold text-white">Campaign Summary</h2>
            
            <Card class="border-[#1a2332] bg-secondary p-8 rounded-2xl">
                <div class="grid gap-6 md:grid-cols-3">
                    <div>
                        <div class="text-sm text-gray-400">Emails Sent</div>
                        <div class="mt-2 text-3xl font-bold text-white">{{ phishingData[0]?.emails_sent }}</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Links Clicked</div>
                        <div class="mt-2 text-3xl font-bold text-[#ff6b35]">{{ phishingData[0]?.links_clicked }}</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Data Submitted</div>
                        <div class="mt-2 text-3xl font-bold text-[#ef4444]">{{ phishingData[0]?.data_submitted }}</div>
                    </div>
                </div>
            </Card>
        </section>
        
    </div>
    <div v-if="!isOpen" class="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        <div
        class="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto border-2 border-orange-500/50">
            <ShieldAlert class="w-10 h-10 text-orange-500" />
        </div>
        
        <p class="text-xl font-bold">
            Ready to Test Your Security Awareness?
        </p>
        <p class="text-sm font-semibold max-w-sm text-center">
            Start a phishing simulation to improve your ability to identify and respond to security threats.
        </p>
        
        <DialogSimulation @sendEmit="toggleDialog" :is-sms="true" />
    </div>
</template>