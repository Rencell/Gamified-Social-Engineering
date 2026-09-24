<script setup lang="ts">
import QuizFlowShell from '@/components/learn/QuizUI/quizFlowShell.vue';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Card from '@/components/ui/card/Card.vue';
import { computed, inject } from 'vue'
import type { QuizType } from '@/components/learn/QuizUI/QuizRegistry';
import FinalQuizFlowShell from '@/components/learn/FinalSummaryUI/FinalQuizFlowShell.vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gamepad2 } from 'lucide-vue-next';
import QuizAIGenerate from './quizAIGenerate.vue'
const editable = inject('editable', false)
const props = defineProps<{
    questions: any;
    quizComponent: unknown;
    editableComponent: unknown;
    quizType: QuizType;
    quizLimit?: number;
}>();

const emit = defineEmits(['onCreateQuestion', 'onCreateFinalQuestion', 'onDeleteQuestion', 'onChangeQuestionType']);

interface QuizMode {
    label: string;
    id: QuizType; // You can expand this to include other quiz types
}

const quiz: QuizMode[] = [
    { label: "Do and Dont", id: "DoDont" },
    { label: "Multiple Choice", id: "MultipleChoice" },
    { label: "Matching Type", id: "MatchingType" },
    { label: "Drag Pair", id: "DragPair" },
    { label: "Phishing Tactics", id: "PhishingTactics" },
    { label: "Module Reward", id: "ModuleReward" },
    { label: "Scenario Story", id: "ScenarioTraining" },
]


function changeQuizType(newType: QuizType) {
    emit('onChangeQuestionType', newType);
}


</script>

<template>
    <component v-if="!editable && quizType === 'ModuleReward'" :is="quizComponent" />

    <FinalQuizFlowShell v-else-if="!editable && quizType === 'FinalTest'" :quiz-component="quizComponent"
        :questions="questions" />
    <QuizFlowShell v-else-if="!editable && quizType !== 'ModuleReward'" :quiz-limit="quizLimit" :questions="questions"
        :quiz-component="quizComponent" :quiz-type="props.quizType" />
    <template v-else>

        <div v-if="quizType !== 'FinalTest'" class="container mx-auto px-6">
            <Card class="bg-background w-full">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Gamepad2 />
                        Quiz Type
                        <Badge variant="secondary" class="text-xs">
                            Required
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                    <!-- Select -->
                    <Select :model-value="quizType" @update:model-value="(v) => changeQuizType(v as QuizType)">
                        <SelectTrigger class="w-full sm:w-72">
                            <SelectValue placeholder="Select quiz type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="value in quiz" :key="value.id" :value="value.id">
                                {{ value.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <!-- Centered button -->
                    <div class="w-full sm:flex-1 flex justify-start">

                        
                    <QuizAIGenerate v-if="quizType != 'ModuleReward'" />
                        
                    </div>
                </CardContent>

                <!-- <Input v-model="quizLimit"></Input> -->
            </Card>
        </div>

        <div class="container mx-auto px-6 py-8">
            <component :is="editableComponent" :questions="questions" />
        </div>
    </template>


</template>