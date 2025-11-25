<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail, Users, MousePointer, Database } from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getCampaigns, getUsers } from "@/services/goPhishService";
import { SimulationService } from '@/services';
import type { GoPhish, GoPhishTotalScore } from '@/services/simulationService';

const openGophish = () => {
    const url = import.meta.env.VITE_GOPHISH_URL || 'https://gophish.example.com';
    window.open(url, '_blank');
};

const phishingData = ref<GoPhishTotalScore>();
const campaignsCount = ref<number>(0);
const usersCount = ref<number>(0);

onMounted(async () => {
  try {
    const response = await SimulationService.get_total_score();
    const respons2 = await SimulationService.get_all();
    phishingData.value = response;
    usersCount.value = respons2.length;
    // fetch campaigns & users counts
    const [campaigns, users] = await Promise.all([getCampaigns(), getUsers()]);
    campaignsCount.value = Array.isArray(campaigns) ? campaigns.length : 0;
    usersCount.value = Array.isArray(users) ? users.length : 0;
  } catch (e) {
    console.error('[admin.vue] stats load error', e);
  }
});
</script>

<template>
    <section class="flex items-center justify-between">
        <h1 class="text-4xl font-bold text-white font-display">Security Risk Score - <span class="text-yellow-500">Email</span></h1>
        <Button @click="openGophish">
            <ExternalLink class="h-4 w-4" />Open Gophish UI
        </Button>
    </section>

    <section class="mx-auto max-w-7xl py-8 ">
        <!-- Key Metrics -->
        <div class="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card class="bg-card">
                <CardHeader class="pb-3">
                    <CardTitle class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Mail class="h-4 w-4" />
                        Total Campaigns
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-foreground">{{ campaignsCount }}</div>
                    <p class="mt-1 text-xs text-muted-foreground">Active campaigns</p>
                </CardContent>
            </Card>

            <Card class="bg-card">
                <CardHeader class="pb-3">
                    <CardTitle class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Users class="h-4 w-4" />
                        Total Users
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-foreground">{{ usersCount }}</div>
                    <p class="mt-1 text-xs text-muted-foreground">Participating users</p>
                </CardContent>
            </Card>

            <Card class="bg-card">
                <CardHeader class="pb-3">
                    <CardTitle class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Mail class="h-4 w-4" />
                        Emails Sent
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-foreground">{{ phishingData?.max_emails_sent ?? 0 }}</div>
                    <p class="mt-1 text-xs text-muted-foreground">Total sent</p>
                </CardContent>
            </Card>

            <Card class="bg-card">
                <CardHeader class="pb-3">
                    <CardTitle class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MousePointer class="h-4 w-4" />
                        Links Clicked
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-foreground">{{ phishingData?.total_links_clicked ?? 0 }}</div>
                    <p class="mt-1 text-xs text-muted-foreground">Click rate: {{ phishingData?.avg_click_rate ?? 0 }}%</p>
                </CardContent>
            </Card>

            <Card class="bg-card">
                <CardHeader class="pb-3">
                    <CardTitle class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Database class="h-4 w-4" />
                        Data Submitted
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-foreground">{{ phishingData?.total_data_submitted ?? 0 }}</div>
                    <p class="mt-1 text-xs text-muted-foreground">Submission rate: {{ phishingData?.avg_submission_rate ?? 0 }}%</p>
                </CardContent>
            </Card>
        </div>
    </section>
</template>