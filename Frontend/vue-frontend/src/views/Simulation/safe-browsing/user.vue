<script setup lang="ts">
import { PopupService, SimulationService } from '@/services';
import type { PopupLogStatistics } from '@/services/popupService';
import { computed, onMounted, ref } from 'vue';
import KpiMetrics from '@/components/simulation/UI/KpiMetrics.vue'
import AvoidGuide from '@/components/simulation/UI/dialogue/avoidGuide.vue';
import type { SimulationGuide } from '@/services/simulationService';
import { useSimulationStore } from '@/stores/simulation';

defineOptions({
    name: 'SafeBrowsingUser',
});


const popupData = ref<PopupLogStatistics>();

onMounted(async() => {
   popupData.value = await PopupService.popup_trigger_log_by_user();
});

interface Summary {
    label: string;
    value: number;
}

const summary = computed<Summary[]>(() => [
    { label: 'Pop-ups Sent', value: popupData.value?.popup_count ?? 0 },
    { label: 'Risky Clicks', value: popupData.value?.total_clicks ?? 0 },
    { label: 'Safe Closes', value: popupData.value?.total_closed ?? 0 }
  
])

const simulationStore = useSimulationStore();

simulationStore.getDialogService('safeBrowsing');
</script>

<template>
    <div class="mx-auto max-w-7xl space-y-12 font-display relative">
        <AvoidGuide 
            :guides="simulationStore.simulationGuides"
            dialog-title="How to Avoid Pop-ups" />
        <KpiMetrics :phishing-data="summary" title="Safe Browsing" :security_score="popupData?.security_score ?? 0" />
    </div>
</template>