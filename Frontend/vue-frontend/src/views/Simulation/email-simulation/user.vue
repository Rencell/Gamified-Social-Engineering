<script setup lang="ts">
import { Card } from '@/components/ui/card';
import RiskIndicator from '@/components/simulation/riskIndicator.vue'
import { SimulationService } from '@/services';
import type { GoPhishEvent } from '@/services/simulationService';
import { computed, onMounted, ref } from 'vue';
import type { GoPhish } from '@/services/simulationService';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Mail, Clock, XCircle, Info } from 'lucide-vue-next';
import DialogSimulation from '@/components/simulation/dialogSimulation.vue'
import Loading from '@/components/loading.vue';

defineOptions({
  name: 'EmailSimulationUser',
});

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

const isInfoOpen = ref(false);
function toggleInfo() {
    isInfoOpen.value = !isInfoOpen.value;
}

const isCampaignInfoOpen = ref(false);
function toggleCampaignInfo() {
    isCampaignInfoOpen.value = !isCampaignInfoOpen.value;
}

</script>

<template>
    <div class="mx-auto max-w-7xl space-y-12 font-display" :class="{ 'blur-md brightness-50': !isOpen }">
        <section>
            <div class="mb-8 flex items-center justify-between gap-4">
                <h1 class="text-4xl font-bold text-white font-display">
                    Security Risk Score - <span class="text-yellow-500">Email</span>
                </h1>

                <div class="relative">
                    <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/40 p-2 text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                        aria-label="What is this score?"
                        :aria-expanded="isInfoOpen"
                        @click="toggleInfo"
                    >
                        <Info class="h-5 w-5 text-blue-500 cursor-pointer" />
                    </button>

                    <!-- lightweight popover/modal -->
                    <div
                        v-if="isInfoOpen"
                        class="absolute right-0 z-50 mt-3 w-[22rem] rounded-xl border border-slate-700 bg-[#0b1220] p-4 shadow-xl"
                        role="dialog"
                        aria-modal="false"
                    >
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <div class="text-sm font-semibold text-white">About the Security Risk Score</div>
                                <div class="mt-1 text-xs leading-relaxed text-slate-300">
                                    This score reflects how safely you respond to simulated security scenarios.
                                    Higher is better.
                                </div>
                            </div>
                            <button
                                type="button"
                                class="rounded-md p-1 text-slate-400 hover:text-white hover:bg-slate-800/60"
                                aria-label="Close"
                                @click="isInfoOpen = false"
                            >
                                <XCircle class="h-5 w-5" />
                            </button>
                        </div>

                        <div class="mt-3 space-y-3 text-xs text-slate-300">
                            <div>
                                <div class="font-semibold text-slate-200">What affects it</div>
                                <ul class="mt-1 list-disc pl-5 space-y-1">
                                    <li>Safe decisions increase your score.</li>
                                    <li>Risky actions (like interacting with suspicious content) can reduce it.</li>
                                    <li>Your history below shows what happened and how it impacted your score.</li>
                                </ul>
                            </div>

                            <div>
                                <div class="font-semibold text-slate-200">What this simulation is</div>
                                <div class="mt-1 leading-relaxed">
                                    A controlled training exercise using realistic prompts to help you practice identifying common social-engineering tactics.
                                </div>
                            </div>

                            <div class="rounded-lg bg-slate-900/40 border border-slate-700 p-3">
                                <div class="font-semibold text-slate-200">Tip</div>
                                <div class="mt-1 leading-relaxed">
                                    Look for urgency, unexpected requests, and links that don’t match the sender.
                                </div>
                            </div>
                        </div>

                        <div class="mt-4 flex justify-end">
                            <Button variant="secondary" @click="isInfoOpen = false">Got it</Button>
                        </div>
                    </div>
                </div>
            </div>

            <Card class="border-[#1a2332] bg-secondary p-8 rounded-2xl">
                <div class="mb-6 flex items-baseline gap-4">
                    <div class="text-5xl font-bold text-white">{{ security_score }}</div>
                    <div class="text-lg text-gray-400">Security Risk Score</div>
                </div>

                <RiskIndicator :score="security_score" :max-score="100" risk-level="low" />

                <p class="mt-6 text-sm leading-relaxed text-gray-400">You’ll occasionally receive realistic security scenarios designed to help you practice spotting suspicious content and making safer choices.</p>
            </Card>
        </section>


        <section>
            <div class="mb-8 flex items-center justify-between gap-4">
                <h2 class="text-3xl font-bold text-white">Campaign Summary</h2>

                <div class="relative">
                    <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/40 p-2 text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                        aria-label="How points work"
                        :aria-expanded="isCampaignInfoOpen"
                        @click="toggleCampaignInfo"
                    >
                        <Info class="h-5 w-5 text-blue-500 cursor-pointer" />
                    </button>

                    <div
                        v-if="isCampaignInfoOpen"
                        class="absolute right-0 z-50 mt-3 w-[22rem] rounded-xl border border-slate-700 bg-[#0b1220] p-4 shadow-xl"
                        role="dialog"
                        aria-modal="false"
                    >
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <div class="text-sm font-semibold text-white">How points work</div>
                                <div class="mt-1 text-xs leading-relaxed text-slate-300">
                                    Actions can increase or decrease your score during the campaign.
                                </div>
                            </div>
                            <button
                                type="button"
                                class="rounded-md p-1 text-slate-400 hover:text-white hover:bg-slate-800/60"
                                aria-label="Close"
                                @click="isCampaignInfoOpen = false"
                            >
                                <XCircle class="h-5 w-5" />
                            </button>
                        </div>

                        <ul class="mt-3 text-sm text-gray-400 space-y-1">
                            <li><span class="text-green-400 font-semibold">+10</span> for each email successfully sent</li>
                            <li><span class="text-orange-400 font-semibold">-20</span> for each link clicked</li>
                            <li><span class="text-red-400 font-semibold">-30</span> for any data submitted</li>
                        </ul>

                        <div class="mt-4 flex justify-end">
                            <Button variant="secondary" @click="isCampaignInfoOpen = false">Got it</Button>
                        </div>
                    </div>
                </div>
            </div>

            <Card class="border-[#1a2332] bg-secondary p-8 rounded-2xl ">
                <div class="grid gap-6 grid-cols-3">
                    <div>
                        <div class="text-sm text-gray-400">Emails Sent</div>
                        <div class="mt-2 text-3xl font-bold text-white">{{ phishingData[0]?.emails_sent || 0 }}</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Links Clicked</div>
                        <div class="mt-2 text-3xl font-bold text-[#ff6b35]">{{ phishingData[0]?.links_clicked || 0 }}</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Data Submitted</div>
                        <div class="mt-2 text-3xl font-bold text-[#ef4444]">{{ phishingData[0]?.data_submitted || 0 }}</div>
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