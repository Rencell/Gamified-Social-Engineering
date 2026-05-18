<script setup lang="ts">
import { SimulationService } from '@/services';
import { computed, onMounted, ref } from 'vue';
import type {  VishingScenario, VishingScenarioTotal } from '@/services/simulationService';
import Loading from '@/components/loading.vue';
import KpiMetrics from '@/components/simulation/UI/KpiMetrics.vue'
import Incoming_call from '@/components/vishing_simulation/incoming_call.vue';
import AvoidGuide from '@/components/simulation/UI/dialogue/avoidGuide.vue';
import { useSimulationStore } from '@/stores/simulation';

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

const simulationStore = useSimulationStore();

simulationStore.getDialogService('vishing');

</script>

<template>
    <Incoming_call v-if="showIncoming" @close="showIncoming = false" @decline="showIncoming = false" />
<!--     
    <Button @click="toggleshit">Toggle Dialog></Button> -->
    <div class="mx-auto max-w-7xl space-y-12 font-display relative">
       
        <AvoidGuide 
            :guides="simulationStore.simulationGuides"
            dialog-title="Scam call? How to Avoid It" />

        <KpiMetrics :phishingData="summary" title="Vishing" :security_score="security_score"/>
        
        <!-- <SimulationHistoryTable :emails="filter_type_phone" title="Vishing History"/> -->
         <button class="px-3 py-2 border rounded" @click="triggerIncomingToast">Trigger Incoming Call Toast</button>
    </div>

    <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        <Loading></Loading>
    </div>
</template>