<script setup lang="ts">
import RiskIndicator from '@/components/simulation/riskIndicator.vue';
import { Card } from '@/components/ui/card';
import { PopupService } from '@/services';
import type { Popup, PopupLogStatistics } from '@/services/popupService';
import { onMounted, ref } from 'vue';


const popupData = ref<PopupLogStatistics>();

onMounted(async() => {
   popupData.value = await PopupService.popup_trigger_log_by_user();
});
</script>

<template>
    <h1 class="mb-8 text-4xl font-bold text-white font-display">
        Safe Browsing
    </h1>

    <div class="space-y-12">
        <Card class="border-[#1a2332] bg-secondary p-8 rounded-2xl font-display">
            <div class="mb-6 flex items-baseline gap-4">
                <div class="text-5xl font-bold text-white">{{ popupData?.security_score }}</div>
                <div class="text-lg text-gray-400">Security Risk Score</div>
            </div>
    
            <RiskIndicator :score="popupData?.security_score ?? 0" :max-score="100" risk-level="low" />
    
            <!-- <p class="mt-6 text-sm leading-relaxed text-gray-400">{description}</p> -->
        </Card>
    
        <Card class="border-[#1a2332] bg-secondary p-8 rounded-2xl">
            <div class="grid grid-cols-3 gap-6 font-display">
                <div class="flex flex-col gap-4">
                    <p>Pop-ups Sent</p>
                    <p class="text-3xl font-bold">{{popupData?.popup_count}}</p>
                </div>
                <div class="flex flex-col gap-4">
                    <p>Risky Clicks</p>
                    <p class="text-3xl font-bold text-red-500">{{popupData?.total_clicks}}</p>
                </div>
                <div class="flex flex-col gap-4">
                    <p>Safe Closes</p>
                    <p class="text-3xl font-bold text-green-500">{{ popupData?.total_closed }}</p>
                </div>
    
            </div>
        </Card>
    </div>
</template>