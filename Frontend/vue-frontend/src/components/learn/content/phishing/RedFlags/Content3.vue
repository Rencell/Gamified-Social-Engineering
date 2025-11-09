<template>
    <LearningContent>
        <LearningSection class="mt-20 w-3xl">
            <Card class="w-full bg-white shadow-lg rounded-lg overflow-hidden p-0 py-2 mb-6">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 pb-0">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold text-xs">G</span>
                        </div>
                        <div>
                            <div class="font-medium text-gray-900">Google</div>
                            <div class="text-xs text-gray-500">&lt;no-reply@google.support&gt;</div>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500">1:38 PM</div>
                </div>

                <!-- Alert Banner -->
                <div class="bg-red-500 text-white p-6">
                    <h1 class="text-lg font-medium">Someone has your password</h1>
                </div>

                <!-- Content -->
                <div class="p-6 py-0 space-y-3">
                    <div>
                        <p class="text-gray-900 mb-2 text-xs font-medium">Hi,</p>
                        <p class="text-gray-900 text-xs font-medium mb-2">
                            Someone just used your password to try to sign in to your Google Account.
                        </p>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class=" text-gray-900 font-medium text-sm">Information:</h3>
                        <div class="space-y-1 text-xs text-gray-700">
                            <div>Wednesday, August 27, 2025 at 1:38:22 PM GMT+08:00</div>
                            <div>Slătina, Romania</div>
                            <div>Firefox browser</div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <p class="text-gray-900 text-xs font-medium">
                            Google <span class="font-medium">stopped</span> this sign-in attempt.
                            <span class="font-medium text-blue-600">You should change your password immediately</span>
                        </p>

                        <Button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium">
                            CHANGE PASSWORD
                        </Button>
                    </div>

                    <div class="pb-4 text-xs font-medium">
                        <p class="text-gray-900">Best,</p>
                        <p class="text-gray-900">The Gmail Team</p>
                    </div>
                </div>

                <!--Tooltip Markers -->
                <ToolTip v-if="toggleTooltips" :areas="areas" :animation-delay="5"/>
            </Card>

            <InteractiveMCQ :mcq="mcq" @showDown="emit('showDown', true)">
                <template #lesson>
                    <LearningHeader>Always check this crucial elements</LearningHeader>
                    <div @vue:mounted="toggleTooltips = true"></div>
                </template>
            </InteractiveMCQ>
        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import InteractiveMCQ from '../../UI/Interactive/InteractiveMCQ.vue';
import type { MCQ } from '../../UI/Interactive/types';
import { computed, onMounted, ref } from 'vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import ToolTip from '../../UI/Interactive/ToolTipImage.vue'
import type {TooltipData} from '../../UI/Interactive/phishing/type'


const toggleTooltips = ref(false)
const areas: TooltipData[] = [
    {
        id: "header",
        title: "Header Section",
        description: "Main navigation and branding area of the website",
        x: 220,
        y: 40,
    },
    {
        id: "sidebar",
        title: "Sidebar Navigation",
        description: "Secondary navigation menu with quick links",
        x: 40,
        y: 180,
    },
    {
        id: "footer",
        title: "Footer Section",
        description: "Contact information, links, and copyright details Search bar to find specific content on the site Search bar to find specific content on the site",
        x: 270,
        y: 110,
    },
    {
        id: "content",
        title: "Main Content Area",
        description: "Primary content section where articles and information are displayed",
        x: 200,
        y: 390,
        position: 'topright'
    },
]

const mcq: MCQ = {
    question: "Observe the email and identify the red flags.",
    options: [
        { id: 'A', text: 'Fake link, Fake google email' },
        { id: 'B', text: 'This seems legitimate come from google' },
        { id: 'C', text: 'The email is good-to-be-true' }
    ],
    correctAnswer: 'A'
};


const emit = defineEmits(['showDown']);

onMounted(() => {
    emit('showDown', false);
});
</script>