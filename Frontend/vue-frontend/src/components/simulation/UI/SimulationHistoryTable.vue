<template>
    <section>
        <button @click="toggleShowHistory"
            class="text-3xl font-bold mb-6 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-3 group">
            History
            <span :class="`inline-block transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`">
                ▼
            </span>
        </button>

        <Card v-if="showHistory" class="bg-white dark:bg-secondary overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="border-b border-slate-200 dark:border-background bg-slate-50 dark:bg-background">
                        <tr>
                            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Subject
                            </th>
                            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Date
                            </th>
                            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Time
                            </th>
                            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Score
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(email, index) in [...emails].reverse()" :key="email.id"
                            :class="`border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors ${index === emails.length - 1 ? 'border-b-0' : ''}`">
                            <td class="px-6 py-4 text-sm text-slate-900 dark:text-white flex items-center gap-3">
                                <Mail class="w-4 h-4 text-slate-500 flex-shrink-0" />
                                <div v-if="email.message.toLowerCase().includes('email/sms sent')"
                                    class="text-green-600 dark:text-green-400">
                                    Email Sent
                                </div>
                                <div v-else-if="email.message.toLowerCase().includes('clicked')"
                                    class="text-orange-600 dark:text-orange-400">
                                    {{ email.message }}
                                </div>
                                <div v-else class="text-red-600 dark:text-red-400">
                                    {{ email.message }}
                                </div>
                            </td>

                            <td class="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                                {{ new Date(email.received_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) }}
                            </td>

                            <td class="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                                <div class="flex gap-5 items-center">
                                    <Clock class="w-4 h-4 flex-shrink-0 inline-block text-slate-500" />
                                    {{ new Date(email.received_at).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) }}
                                </div>
                            </td>

                            <td class="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                                <div v-if="email.message.toLowerCase().includes('email/sms sent')"
                                    class="text-green-600 dark:text-green-400">
                                    +10
                                </div>
                                <div v-else-if="email.message.toLowerCase().includes('clicked')"
                                    class="text-orange-600 dark:text-orange-400">
                                    -20
                                </div>
                                <div v-else class="text-red-600 dark:text-red-400">
                                    -30
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Card>
    </section>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { Clock, Mail } from 'lucide-vue-next';
import { ref } from 'vue';

const showHistory = ref(false);
const toggleShowHistory = () => {
    showHistory.value = !showHistory.value;
};

interface Email {
    id: number;
    message: string;
    received_at: string;
}

defineProps<{
    emails: Email[];
}>();
</script>