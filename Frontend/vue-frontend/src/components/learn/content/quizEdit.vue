<script setup lang="ts">
import QuizFlowShell from '@/components/learn/QuizUI/quizFlowShell.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Card from '@/components/ui/card/Card.vue';
import { Gamepad2 } from 'lucide-vue-next';
import { ref, inject } from 'vue'
import type { QuizType } from '@/components/learn/QuizUI/QuizRegistry';
import FinalQuizFlowShell from '@/components/learn/FinalSummaryUI/FinalQuizFlowShell.vue';
import { Input } from '@/components/ui/input';
const editable = inject('editable', false)
defineProps<{
    questions: any;
    quizComponent: any;
    editableComponent: any;
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
    { label: "Module Reward", id: "ModuleReward" },
    { label: "Scenario Story", id: "ScenarioTraining" },
]

function changeQuizType(newType: QuizType) {
    emit('onChangeQuestionType', newType);
}
</script>

<template>
    <component v-if="!editable && quizType === 'ModuleReward'" :is="quizComponent" />
    
    <FinalQuizFlowShell v-else-if="!editable && quizType === 'FinalTest'" :quiz-component="quizComponent" :questions="questions" />
    <QuizFlowShell v-else-if="!editable && quizType !== 'ModuleReward'"  :quiz-limit="quizLimit" :questions="questions" :quiz-component="quizComponent" />

    <template v-else>

        <div v-if="quizType !== 'FinalTest'" class="container mx-auto px-6">
            <Card class="bg-background w-full">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        Quiz Type
                        <Badge variant="secondary" class="text-xs">
                            Required
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-4 flex gap-2">
                    <Button v-for="value in quiz" :key="value.id"
                        :variant="value.id === quizType ? 'default' : 'outline'" size="sm" class="gap-2"
                        @click="changeQuizType(value.id)">
                        <Gamepad2 class="h-4 w-4" />
                        {{ value.label }}
                    </Button>

                    
                </CardContent>

                <!-- <Input v-model="quizLimit"></Input> -->
            </Card>
        </div>

        <div class="container mx-auto px-6 py-8">
            
            <component :is="editableComponent" :questions="questions" 
                 
                @toggleOnCreateQuestion="emit('onCreateQuestion')"
                @toggleOnDeleteQuestion="emit('onDeleteQuestion', $event)"
                @toggleOnCreateFinalQuestion="emit('onCreateFinalQuestion', $event)" />
        </div>
    </template>

    
</template>