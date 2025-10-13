<script setup lang="ts">
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, ImageIcon, Plus, Check, Trash2 } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import SidebarEdittable from '../SidebarEdittable.vue';
import { defaultPropsMap } from '../QuizRegistry';

const props = defineProps<{
    questions: any[];
}>();

const currentIndex = ref(0);
const quizData = computed(() => props.questions[currentIndex.value] || null);

defineEmits(['toggleOnCreateQuestion', 'toggleOnDeleteQuestion']);

function setCorrectAnswer(id: number) {
    quizData.value.answer = id;
}

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
                        <label class="text-sm font-medium text-foreground mb-2 block">Question</label>
                        <Textarea placeholder="Enter your question here..." v-model="quizData.text"
                            class="min-h-[100px] resize-none" />
                    </div>
                </CardContent>
            </Card>

            <!-- Answer Options -->
            <Card class="bg-background">
                <CardHeader>
                    <div class="flex items-center justify-between">
                        <CardTitle class="flex items-center gap-2">
                            Answer Options
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent class="space-y-3">
                    <div v-for="(option, index) in [0, 1]" :key="index"
                        class="flex items-center gap-3 p-3 border rounded-lg bg-card">
                        <div class="flex items-center gap-2">
                            <GripVertical class="h-4 w-4 text-muted-foreground cursor-move" />
                        </div>

                        {{ option === 0 ? 'Do' : 'Dont' }}

                        <Button :variant="quizData.answer === option ? 'default' : 'outline'" size="sm"
                            @click="setCorrectAnswer(option)" class="ms-auto gap-1 min-w-[80px]">
                            <template v-if="quizData.answer === option">
                                <Check class="h-3 w-3" />
                                Correct
                            </template>
                            <template v-else>
                                Mark
                            </template>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Sidebar -->
        <SidebarEdittable
            :questions="props.questions"
            :currentIndex="currentIndex"
            @update:currentIndex="currentIndex = $event"
            :propsMap="defaultPropsMap.DoDont"
        />
    </div>
</template>