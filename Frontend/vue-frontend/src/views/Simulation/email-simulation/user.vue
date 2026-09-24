<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RiskIndicator from '@/components/simulation/riskIndicator.vue'
import { SimulationService } from '@/services';
import type { GoPhishEvent } from '@/services/simulationService';
import { computed, onMounted, ref } from 'vue';
import type { GoPhish } from '@/services/simulationService';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShieldAlert, Mail, Clock, CheckCircle2, XCircle } from 'lucide-vue-next';
import DialogSimulation from '@/components/simulation/dialogSimulation.vue'
import Loading from '@/components/loading.vue';


const phishingData = ref<GoPhish[]>([])
const eventsData = ref<GoPhishEvent[]>([])
const filter_type_email = computed(() => eventsData.value.filter(event => event.type === 'email'))

const isOpen = ref(false);
function toggleDialog() {
    isOpen.value = !isOpen.value;
    toggleshit();
}
const isLoading = ref(true);
onMounted(async () => {

    isLoading.value = true;
    // Fetch simulation data when the component is mounted
    try {
        const response = await SimulationService.get_all();
        const consent = await SimulationService.get_consent();
        phishingData.value = response;
        eventsData.value = await SimulationService.get_events() as unknown as GoPhishEvent[];
        isOpen.value = consent.email_consent;
    } catch (error) {
        console.error('Error fetching simulation data:', error);
    } finally {
        isLoading.value = false;
    }
});

const security_score = computed(() => {
    if (phishingData.value.length > 0) {
        return phishingData.value[0].security_score;
    }
    return 0; // Default score if data is not available
});

const toggleshit = (async () => {
    try {
        await SimulationService.update_email_consent(true);
    } catch (error) {
        console.error('Error updating consent:', error);
    }
});


const showHistory = ref(false);
function toggleShowHistory() {
    showHistory.value = !showHistory.value;
}

</script>

<template>
    <!--     
    <Button @click="toggleshit">Toggle Dialog></Button> -->
    <div class="mx-auto max-w-7xl space-y-12 font-display" :class="{ 'blur-md brightness-50': !isOpen }">
        <section>
            <h1 class="mb-8 text-4xl font-bold text-white font-display">Security Risk Score - <span class="text-yellow-500">Email</span></h1>
            <Card class="border-[#1a2332] bg-secondary p-8 rounded-2xl">
                <div class="mb-6 flex items-baseline gap-4">
                    <div class="text-5xl font-bold text-white">{{ security_score }}</div>
                    <div class="text-lg text-gray-400">Security Risk Score</div>
                </div>

                <RiskIndicator :score="security_score" :max-score="100" risk-level="low" />

                <!-- <p class="mt-6 text-sm leading-relaxed text-gray-400">{description}</p> -->
            </Card>
        </section>


        <section>
            <h2 class="mb-8 text-3xl font-bold text-white">Campaign Summary</h2>

            <Card class="border-[#1a2332] bg-secondary p-8 rounded-2xl ">
                <div class="grid gap-6 grid-cols-3">
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

        <section>
            <button @click="toggleShowHistory"
                class="text-3xl font-bold mb-6 cursor-pointer hover:text-slate-300 transition-colors flex items-center gap-3 group">
                History
                <span :class="`inline-block transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`">
                    ▼
                </span>
            </button>

            <Card v-if="showHistory" class="bg-secondary overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="border-b border-background bg-background">
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Subject</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Time</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(email, index) in [...filter_type_email].reverse()" :key="email.id" :class="`border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${index === eventsData.length - 1 ? 'border-b-0' : ''
                                }`">
                                <td class="px-6 py-4 text-sm text-white flex items-center gap-3">
                                    <Mail class="w-4 h-4 text-slate-500 flex-shrink-0" />
                                    <div v-if="email.message.toLowerCase().includes('email/sms sent')"
                                        class="text-green-400">
                                        Email Sent
                                    </div>
                                    <div v-else-if="email.message.toLowerCase().includes('clicked')"
                                        class="text-orange-400">
                                        {{ email.message }}
                                    </div>
                                    <div v-else
                                        class="text-red-400">
                                        {{ email.message }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-slate-300 ">
                                    {{ new Date(email.received_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month:
                                    'long', day: 'numeric' }) }}
                                </td>
                                <td class="px-6 py-4 text-sm text-slate-300 ">
                                    <div class="flex gap-5">
                                        <Clock class="w-4 h-4 flex-shrink-0 inline-block" />
                                        {{ new Date(email.received_at).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                        minute: '2-digit' }) }}
                                    </div>
                                </td>

                                <td class="px-6 py-4 text-sm text-slate-300 ">
                                    <div v-if="email.message.toLowerCase().includes('email/sms sent')"
                                        class="text-green-400">
                                        +10
                                    </div>
                                    <div v-else-if="email.message.toLowerCase().includes('clicked')"
                                        class="text-orange-400">
                                        -20
                                    </div>
                                    <div v-else class="text-red-400">
                                        -30
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </section>
    </div>
    <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        <Loading></Loading>
    </div>
    <div v-else-if="!isOpen" class="absolute inset-0 flex flex-col items-center justify-center space-y-4">
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

        <DialogSimulation @sendEmit="toggleDialog" :is-sms="false"/>
    </div>
</template>