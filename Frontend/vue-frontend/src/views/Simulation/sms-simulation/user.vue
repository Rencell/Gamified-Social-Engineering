<script setup lang="ts">
import { Card } from '@/components/ui/card';
import RiskIndicator from '@/components/simulation/riskIndicator.vue'
import { SimulationService } from '@/services';
import { computed, onMounted, ref } from 'vue';
import type {  GoPhishEvent, GoPhishSMS } from '@/services/simulationService';
import {CircleQuestionMark, Clock, Mail, ShieldAlert } from 'lucide-vue-next';
import DialogSimulation from '@/components/simulation/dialogSimulation.vue'
import Loading from '@/components/loading.vue';
import KpiMetrics from '@/components/simulation/UI/KpiMetrics.vue'
import SimulationHistoryTable from '@/components/simulation/UI/SimulationHistoryTable.vue';
import AvoidGuide from '@/components/simulation/UI/dialogue/avoidGuide.vue';
import Button from '@/components/ui/button/Button.vue';
import { useSimulationStore } from '@/stores/simulation';

const phishingData = ref<GoPhishSMS[]>([])
const eventsData = ref<GoPhishEvent[]>([])
const filter_type_phone = computed(() => eventsData.value.filter(event => event.type === 'phone'))

const isOpen = ref(false);
function toggleDialog(phone: string) {
    isOpen.value = !isOpen.value;
    toggleConsent(phone);
}
const toggleConsent = (async (phone: string) => {
    try {
        await SimulationService.update_phone_consent(phone);
    } catch (error) {
        console.error('Error updating consent:', error);
    }
});

const isLoading = ref(true);
onMounted(async () => {
    // Fetch simulation data when the component is mounted
    isLoading.value = true;
    try {
        const response = await SimulationService.get_all_sms();
        const consent = await SimulationService.get_consent();
        phishingData.value = response;
        eventsData.value = await SimulationService.get_events() as unknown as GoPhishEvent[];
        isOpen.value = consent.phone_consent;
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

const showHistory = ref(false);
function toggleShowHistory() {
    showHistory.value = !showHistory.value;
}

interface Summary {
    label: string;
    value: number;
}

const summary = computed<Summary[]>(() => [
    { label: 'SMS Sent', value: phishingData.value[0]?.number_sent ?? 0 },
    { label: 'Links Clicked', value: phishingData.value[0]?.links_clicked ?? 0 },
    { label: 'Data Submitted', value: phishingData.value[0]?.data_submitted ?? 0 },
]);

const simulationStore = useSimulationStore();

simulationStore.getDialogService('smishing');

</script>

<template>
<!--     
    <Button @click="toggleshit">Toggle Dialog></Button> -->
    <div class="mx-auto max-w-7xl space-y-12 font-display relative"
        :class="{ 'blur-md brightness-50': !isOpen }">
       
        <AvoidGuide 
            :guides="simulationStore.simulationGuides"
            dialog-title="How to Avoid SMS Phishing" />

        <KpiMetrics :phishingData="summary" title="SMS" :security_score="security_score"/>
        
        <SimulationHistoryTable :emails="filter_type_phone" title="SMS History"/>
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
        
        <DialogSimulation @sendEmit="toggleDialog($event)" :is-sms="true" />
    </div>
</template>