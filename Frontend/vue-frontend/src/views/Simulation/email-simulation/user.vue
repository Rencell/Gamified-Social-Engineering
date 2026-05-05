<script setup lang="ts">
import { Card } from '@/components/ui/card';
import RiskIndicator from '@/components/simulation/riskIndicator.vue'
import { SimulationService } from '@/services';
import type { GoPhishEvent } from '@/services/simulationService';
import { computed, onMounted, ref } from 'vue';
import type { GoPhish } from '@/services/simulationService';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Mail, Clock, XCircle, Info, CircleQuestionMark } from 'lucide-vue-next';
import DialogSimulation from '@/components/simulation/dialogSimulation.vue'
import Loading from '@/components/loading.vue';
import KpiMetrics from '@/components/simulation/UI/KpiMetrics.vue'
import SimulationHistoryTable from '@/components/simulation/UI/SimulationHistoryTable.vue';
import AvoidGuide from '@/components/simulation/UI/dialogue/avoidGuide.vue';
import { useSimulationStore } from '@/stores/simulation';

defineOptions({
  name: 'EmailSimulationUser',
});

const phishingData = ref<GoPhish[]>([])
const eventsData = ref<GoPhishEvent[]>([])


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

interface Summary {
    label: string;
    value: number;
}

interface Email {
    id: number;
    message: string;
    received_at: string;
}

const filter_type_email = computed(() => eventsData.value.filter(event => event.type === 'email'))

const summary = computed<Summary[]>(() => [
    { label: 'Email Sent', value: phishingData.value[0]?.emails_sent ?? 0 },
    { label: 'Links Clicked', value: phishingData.value[0]?.links_clicked ?? 0 },
    { label: 'Data Submitted', value: phishingData.value[0]?.data_submitted ?? 0 },
]);

const simulationStore = useSimulationStore();

simulationStore.getDialogService('phishing');

</script>

<template>
    <div class="mx-auto max-w-7xl space-y-12 font-display relative" :class="{ 'blur-md brightness-50': !isOpen }">
        <AvoidGuide 
            :guides="simulationStore.simulationGuides"
            dialog-title="How to Avoid Email Phishing" />
        <KpiMetrics :security_score="security_score" :phishingData="summary" title="Email" />

        <SimulationHistoryTable :emails="filter_type_email" title="s"/>
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