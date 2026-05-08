<script setup lang="ts">
import { Card } from '@/components/ui/card';
import RiskIndicator from '@/components/simulation/riskIndicator.vue'
import { SimulationService } from '@/services';
import { computed, onMounted, ref } from 'vue';
import type {  GoPhishEvent, VishingScenario, VishingScenarioTotal } from '@/services/simulationService';
import {CircleQuestionMark, Clock, Mail, ShieldAlert } from 'lucide-vue-next';
import DialogSimulation from '@/components/simulation/dialogSimulation.vue'
import Loading from '@/components/loading.vue';
import KpiMetrics from '@/components/simulation/UI/KpiMetrics.vue'
import SimulationHistoryTable from '@/components/simulation/UI/SimulationHistoryTable.vue';
import { showIncomingCallToast } from '@/components/vishing_simulation/UI/toastCall';
import Incoming_call from '@/components/vishing_simulation/incoming_call.vue';
import AvoidGuide from '@/components/simulation/UI/dialogue/avoidGuide.vue';
import { Button } from '@/components/ui/button';

const phishingData = ref<VishingScenario[]>([]);
const phishingDataTotal = ref<VishingScenarioTotal | null>(null);

const isOpen = ref(false);

const isLoading = ref(true);
onMounted(async () => {
    // Fetch simulation data when the component is mounted
    isLoading.value = true;
    try {
        const response = await SimulationService.get_vishing_scenarios();
        const total = await SimulationService.get_vishing_scenarios_total();
        phishingDataTotal.value = total;
        phishingData.value = response;
    } catch (error) {
        console.error('Error fetching simulation data:', error);
    } finally {
        isLoading.value = false;
    }
});

const security_score = computed(() => {
    if (phishingDataTotal.value) {
        return phishingDataTotal.value.security_score;
    }
    return 0; // Default score if data is not available
});

interface Summary {
    label: string;
    value: number;
}

const summary = computed<Summary[]>(() => [
    { label: 'Vishing Total', value: phishingDataTotal.value?.total ?? 0 },
    { label: 'Gave Information', value: phishingDataTotal.value?.gave_information ?? 0 },
    { label: 'Contact Refused', value: phishingDataTotal.value?.refused ?? 0 },
]);

const showIncoming = ref(false)
function triggerIncomingToast() {
    showIncoming.value = true
}

</script>

<template>
    <Incoming_call v-if="showIncoming" @close="showIncoming = false" @decline="showIncoming = false" />
<!--     
    <Button @click="toggleshit">Toggle Dialog></Button> -->
    <div class="mx-auto max-w-7xl space-y-12 font-display relative">
       
        <AvoidGuide/>
        <KpiMetrics :phishingData="summary" title="Vishing" :security_score="security_score"/>
        
        <!-- <SimulationHistoryTable :emails="filter_type_phone" title="Vishing History"/> -->
         <button class="px-3 py-2 border rounded" @click="triggerIncomingToast">Trigger Incoming Call Toast</button>
    </div>

    <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        <Loading></Loading>
    </div>
</template>