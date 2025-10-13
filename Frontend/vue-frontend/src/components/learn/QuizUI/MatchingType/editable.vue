<script setup lang="ts">
import { computed, ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import SidebarEdittable from '../SidebarEdittable.vue';
import { defaultPropsMap } from '../QuizRegistry';

const props = defineProps<{
    questions: any[];
}>();

const currentIndex = ref(0);
const quizData = computed(() => props.questions[currentIndex.value] || null);

defineEmits(['toggleOnCreateQuestion', 'toggleOnDeleteQuestion']);
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content Area -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Question Section -->
            <Card class="bg-background">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        Question Content
                        <Badge variant="secondary" class="text-xs">
                            Required
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-foreground mb-2 block">Match A</label>
                        <Textarea placeholder="Enter your question here..." v-model="quizData.match_A"
                            class="min-h-[100px] resize-none" />
                    </div>
                    <div>
                        <label class="text-sm font-medium text-foreground mb-2 block">Match B</label>
                        <Textarea placeholder="Enter your question here..." v-model="quizData.match_B"
                            class="min-h-[100px] resize-none" />
                    </div>


                </CardContent>
            </Card>

        </div>

        <!-- Sidebar -->
        <SidebarEdittable
            :questions="props.questions"
            :currentIndex="currentIndex"
            :propsMap="defaultPropsMap.MatchingType"
            @update:currentIndex="currentIndex = $event"
        />
    </div>
</template>