<script setup lang="ts">
import RiskIndicator from '@/components/simulation/riskIndicator.vue';
import { Card } from '@/components/ui/card';
import { PopupService } from '@/services';
import type { Popup, PopupLogStatistics } from '@/services/popupService';
import { computed, onMounted, ref } from 'vue';
import KpiMetrics from '@/components/simulation/UI/KpiMetrics.vue'


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


</script>

<template>
     <div class="mx-auto max-w-7xl space-y-12 font-display">
        <KpiMetrics :phishing-data="summary" title="Safe Browsing" :security_score="popupData?.security_score ?? 0" />
    </div>
</template>