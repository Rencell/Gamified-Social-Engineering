<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-vue-next';
import { useContentStore } from '@/stores/content';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { defaultScenarioProps } from '../../QuizRegistry';
const contentStore = useContentStore();
// Props to receive the questions and current index
const props = defineProps<{
    questions: any[];
    currentIndex: number;
}>();

// Emits to handle events
const emit = defineEmits(['update:currentIndex']);

// Function to handle question selection
function selectQuestion(index: number) {
    emit('update:currentIndex', index);
}

const editQuestion = computed(() => props.questions);

function deleteQuestion(index: number) {
    if (editQuestion.value.length <= 1) {
        alert("You must have at least one question.");
        return;
    }

    if (props.currentIndex === index) {
        emit('update:currentIndex', Math.max(0, index - 1));
    } else if (props.currentIndex > index) {
        emit('update:currentIndex', 0);
    }

    editQuestion.value.splice(index, 1);
}

const addStory = () => {
    editQuestion.value.push(defaultScenarioProps.Story)
    if(props.questions.length <= 10) {
        contentStore.contentItems.quiz_limit = props.questions.length;
    }
}

const addMCQ = () => {
    editQuestion.value.push(defaultScenarioProps.MCQ)
    if(props.questions.length <= 10) {
        contentStore.contentItems.quiz_limit = props.questions.length;
    }
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

                <div v-for="(value, index) in questions" :key="index" class="space-y-2">
                    <div class="flex justify-between text-sm hover:bg-ternary/10 rounded-lg cursor-pointer p-1"
                        :class="index === currentIndex ? 'bg-accent/50 font-medium p-2' : ''"
                        @click="selectQuestion(index)">
                        <span class="text-sidebar-foreground">{{value.type}} #{{ index + 1 }}</span>
                        <Trash2 class="h-4 w-4 text-destructive hover:text-destructive hover:opacity-100"
                            @click.stop="deleteQuestion(index)" />
                    </div>
                </div>
                <div class="flex flex-col gap-2 mt-4">
                    <Button variant="outline" size="sm" @click="addStory"
                        class="gap-2 bg-transparent">
                        <Plus class="h-4 w-4" />
                        Add Story
                    </Button>
                    <Button variant="outline" size="sm" @click="addMCQ"
                        class="gap-2 bg-transparent">
                        <Plus class="h-4 w-4" />
                        Add Quiz
                    </Button>
                </div>
                
            </CardContent>
        </Card>
        <div class="w-full flex justify-end">
            <Button size="sm" class=" mt-5" @click="contentStore.updateContentsQuiz">
                Save Scenario</Button>
        </div>
    </div>

</template>