<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-vue-next';
import { useContentStore } from '@/stores/content';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { defaultFinalTestProps, type FinalTestProps, defaultPropsMap } from './QuizRegistry';

const contentStore = useContentStore();
// Props to receive the questions and current index
const props = defineProps<{
    questions: any[];
    propsMap: any;
    currentIndex: number;
    isFinal?: boolean;
}>();

const editQuestion = computed(() => props.questions);

// Emits to handle events
const emit = defineEmits(['update:currentIndex']);

// Function to handle question selection
function selectQuestion(index: number) {
    emit('update:currentIndex', index);
}


function deleteQuestion(index: number) {
    if (props.questions.length <= 1) {
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

function addQuestion() {
    const newDragPair = JSON.parse(JSON.stringify(props.propsMap));
    editQuestion.value.push(newDragPair);
    if(props.questions.length <= 10) {
        contentStore.contentItems.quiz_limit = props.questions.length;
    }
}

function finalAddQuestion(type: keyof typeof defaultFinalTestProps) {
    const newFinalQuestion = JSON.parse(JSON.stringify(defaultFinalTestProps[type]));
    editQuestion.value.push(newFinalQuestion);
}

const checkbox = ref(true);

const isQuizLimitInvalid = computed(() => {
    return (contentStore.contentItems.quiz_limit ?? 0) > props.questions.length;
});

onMounted(() => {
    if(props.questions.length <= 10) {
        contentStore.contentItems.quiz_limit = props.questions.length;
    }
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
                <p v-show="(contentStore.contentItems.pass_rate || 1) > 100" class="text-xs text-red-500">The ideal
                    limit is 0-100%
                </p>
                <div v-for="(value, index) in editQuestion" :key="index" class="space-y-2">
                    <div class="flex justify-between text-sm hover:bg-ternary/10 rounded-lg cursor-pointer p-1"
                        :class="index === currentIndex ? 'bg-accent/50 font-medium p-2' : ''"
                        @click="selectQuestion(index)">
                        <span class="text-sidebar-foreground">Question #{{ index + 1 }}</span>
                        <Trash2 class="h-4 w-4 text-destructive hover:text-destructive hover:opacity-100"
                            @click="deleteQuestion(index)" />
                    </div>

                </div>

                <Button v-if="!isFinal" variant="outline" size="sm" @click="addQuestion"
                    class="gap-2 bg-transparent">
                    <Plus class="h-4 w-4" />
                    Add Question
                </Button>
                <div v-else class="flex flex-col gap-2">
                    <Button variant="outline" size="sm" @click="finalAddQuestion('MultipleChoice')"
                        class="gap-2 bg-transparent w-full">
                        <Plus class="h-4 w-4" />
                        Add Multiple Choice
                    </Button>
                    <Button variant="outline" size="sm" @click="finalAddQuestion('TwoImage')"
                        class="gap-2 bg-transparent w-full">
                        <Plus class="h-4 w-4" />
                        Add Two Image
                    </Button>
                    <Button variant="outline" size="sm" @click="finalAddQuestion('TrueFalse')"
                        class="gap-2 bg-transparent w-full">
                        <Plus class="h-4 w-4" />
                        Add True or False
                    </Button>
                    <Button variant="outline" size="sm" @click="finalAddQuestion('Email')"
                        class="gap-2 bg-transparent w-full">
                        <Plus class="h-4 w-4" />
                        Add Email Question
                    </Button>
                    <Button variant="outline" size="sm" @click="finalAddQuestion('Sms')"
                        class="gap-2 bg-transparent w-full">
                        <Plus class="h-4 w-4" />
                        Add SMS Question
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