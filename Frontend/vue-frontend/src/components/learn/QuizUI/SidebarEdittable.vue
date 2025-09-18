<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-vue-next';
import { useContentStore } from '@/stores/content';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const contentStore = useContentStore();
// Props to receive the questions and current index
const props = defineProps<{
    questions: any[];
    currentIndex: number;
    isFinal?: boolean;
}>();

// Emits to handle events
const emit = defineEmits(['update:currentIndex', 'toggleOnCreateQuestion', 'toggleOnDeleteQuestion', 'toggleOnCreateFinalQuestion']);

// Function to handle question selection
function selectQuestion(index: number) {
    emit('update:currentIndex', index);
}


function deleteQuestion(index: number) {
    if (props.questions.length <= 1) {
        alert("You must have at least one question.");
        return;
    }
    emit('toggleOnDeleteQuestion', index);
}
const checkbox = ref(true);
const isQuizLimitInvalid = computed(() => {
    return (contentStore.contentItems.quiz_limit ?? 0) > props.questions.length;
});
</script>

<template>
    <div>
        <Card class="bg-background border-sidebar-border h-fit">
            <CardHeader>
                <CardTitle class="text-sidebar-foreground">Question Status</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="gap-2 flex items-center justify-end text-sm">
                    Edit Default <Checkbox v-model="checkbox"></Checkbox>
                </div>
                <div class="flex items-center gap-2">
                    <p class="text-xs w-25">Quiz Limit:</p>

                    <Input :disabled="checkbox" type="number" v-model="contentStore.contentItems.quiz_limit"
                        placeholder="Enter quiz limit"
                        :class="{ 'border-red-500 focus-visible:ring-red-500': isQuizLimitInvalid }" />
                </div>
                <p v-show="isQuizLimitInvalid" class="text-xs text-red-500">The ideal limit is 1-{{ questions.length }}
                </p>
                <div class="flex items-center gap-2">
                    <p class="text-xs w-30">Pass rate:</p>

                    <Input :disabled="checkbox" type="number" v-model="contentStore.contentItems.pass_rate"
                        placeholder="Enter pass rate"
                        :class="{ 'border-red-500 focus-visible:ring-red-500': (contentStore.contentItems.pass_rate || 1) > 100 }" />
                    %
                </div>
                <p v-show="(contentStore.contentItems.pass_rate || 1) > 100" class="text-xs text-red-500">The ideal limit is 0-100%
                </p>
                <div v-for="(value, index) in questions" :key="index" class="space-y-2">
                    <div class="flex justify-between text-sm hover:bg-ternary/10 rounded-lg cursor-pointer p-1"
                        :class="index === currentIndex ? 'bg-accent/50 font-medium p-2' : ''"
                        @click="selectQuestion(index)">
                        <span class="text-sidebar-foreground">Question #{{ index + 1 }}</span>
                        <Trash2 class="h-4 w-4 text-destructive hover:text-destructive hover:opacity-100"
                            @click.stop="deleteQuestion(index)" />
                    </div>
                </div>
                <Button v-if="!isFinal" variant="outline" size="sm" @click="$emit('toggleOnCreateQuestion')"
                    class="gap-2 bg-transparent">
                    <Plus class="h-4 w-4" />
                    Add Question
                </Button>
                <div v-else class="flex flex-col gap-2">
                    <Button variant="outline" size="sm" @click="$emit('toggleOnCreateFinalQuestion', 'MultipleChoice')"
                        class="gap-2 bg-transparent w-full">
                        <Plus class="h-4 w-4" />
                        Add Multiple Choice
                    </Button>
                    <Button variant="outline" size="sm" @click="$emit('toggleOnCreateFinalQuestion', 'TwoImage')"
                        class="gap-2 bg-transparent w-full">
                        <Plus class="h-4 w-4" />
                        Add Two Image
                    </Button>
                    <Button variant="outline" size="sm" @click="$emit('toggleOnCreateFinalQuestion', 'TrueFalse')"
                        class="gap-2 bg-transparent w-full">
                        <Plus class="h-4 w-4" />
                        Add True or False
                    </Button>
                </div>
            </CardContent>
        </Card>
        <div class="w-full flex justify-end">
            <Button :disabled="isQuizLimitInvalid" size="sm" class=" mt-5" @click="contentStore.updateContentsQuiz">Save
                Quiz</Button>
        </div>
    </div>

</template>