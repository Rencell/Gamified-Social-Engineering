<script setup lang="ts">
import { Mail, Users, MousePointer, Database } from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PopupService } from '@/services';
import { onMounted, ref } from 'vue';

// Ensure component has a multi-word name for linting rules
defineOptions({ name: 'SafeBrowsingAdmin' });

// Local state for totals
const popupsSent = ref(0);
const riskyClicks = ref(0);
const safeCloses = ref(0);
const overallRiskRate = ref(0);

onMounted(async () => {
  try {
    const totals = await PopupService.get_totals();
    popupsSent.value = totals.total_popups_sent ?? 0;
    riskyClicks.value = totals.total_risky_clicks ?? 0;
    safeCloses.value = totals.total_safe_closes ?? 0;
    overallRiskRate.value = totals.overall_risk_rate ?? 0;
  } catch {
    // silently fail; keep defaults
  }
});
</script>

<template>
    <h1 class="mb-8 text-4xl font-bold text-white font-display">
        Safe Browsing
    </h1>

    <section class="mx-auto max-w-7xl py-8 ">
        <!-- Key Metrics -->
        <div class="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card class="bg-card">
                <CardHeader class="pb-3">
                    <CardTitle class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Mail class="h-4 w-4" />
                        Total Pop-ups Sent
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-foreground">{{ popupsSent }}</div>
                    <p class="mt-1 text-xs text-muted-foreground">Total sent</p>
                </CardContent>
            </Card>

            <Card class="bg-card">
                <CardHeader class="pb-3">
                    <CardTitle class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MousePointer class="h-4 w-4" />
                        Total Risky Clicks
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-foreground">{{ riskyClicks }}</div>
                    <p class="mt-1 text-xs text-muted-foreground">Risky interactions</p>
                </CardContent>
            </Card>

            <Card class="bg-card">
                <CardHeader class="pb-3">
                    <CardTitle class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Users class="h-4 w-4" />
                        Total Safe Closes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-foreground">{{ safeCloses }}</div>
                    <p class="mt-1 text-xs text-muted-foreground">Closed without clicking</p>
                </CardContent>
            </Card>

            <Card class="bg-card">
                <CardHeader class="pb-3">
                    <CardTitle class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Database class="h-4 w-4" />
                        Overall Risk Rate (%)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-foreground">{{ overallRiskRate }}%</div>
                    <p class="mt-1 text-xs text-muted-foreground">Aggregate risk</p>
                </CardContent>
            </Card>
        </div>
    </section>
</template>