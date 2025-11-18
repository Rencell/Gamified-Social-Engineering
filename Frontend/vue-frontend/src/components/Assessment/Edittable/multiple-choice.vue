<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, ImageIcon, Plus, Check, Trash2, Flag } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { computed, onMounted, ref } from 'vue';

import { useUploadContentQuiz } from '@/composables/useUploadContentQuiz';
import type { Question, Option } from '@/services/assessmentService';
import { useAssessmentStore } from '@/stores/assessment';
const { previewUrl, changeUpdate, onFileChange, selectedFile } = useUploadContentQuiz();

const assessmentStore = useAssessmentStore();
const image1 = useUploadContentQuiz();
const image2 = useUploadContentQuiz();

const props = defineProps<{
    question: Question;
}>();

const quizData = computed(() => props.question);

const quizanswer = ref('');

function setCorrectAnswer(id: "image1" | "image2") {
    quizanswer.value = id;
}
function setCorrectAnswerMc(id: number) {
    quizData.value.options.forEach(option => {
        option.is_correct = option.id === id
    })
}

function addOption() {
    if (quizData.value.options.length >= 4) return; // Limit to 4 options
    const nextId = String.fromCharCode(97 + quizData.value.options.length); // Generate 'a', 'b', 'c', etc.
    quizData.value.options.push({ id: nextId, text: '' });
    const newOption = {
        id: 0,
        text: '',
        question: quizData.value.id as number,
        is_correct: false
    };
    assessmentStore.addOption(newOption);
}

const updateOption = async (option: Option) => {
    await assessmentStore.updateOption(option);
    
}

function removeOption(id: number) {
    if (quizData.value.options.length > 2) {
        quizData.value.options = quizData.value.options.filter((option: { id: number }) => option.id !== id);
    }
}

const toggleChange = ref(false);
const toggle = () => {
    toggleChange.value = !toggleChange.value;
};

const saveChanges = async () => {
    // Save changes logic here
    toggle();
    setTimeout(() => {
        toggle();
    }, 1000);
    quizData.value.image = selectedFile.value || quizData.value.image;
    await assessmentStore.updateQuestions(quizData.value);
};
</script>

<template>
    <!-- Question Section -->
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                Question Content
                <Badge variant="secondary" class="text-xs">
                    Required
                </Badge>
            </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
            <!-- <div>
                
                <label for="question-type" class="text-sm font-medium text-foreground mb-2 block">Question Type</label>
                <Select v-model="quizData.question_type" :default-value="'multiple_choice'">
                    <SelectTrigger id="question-type" class="!bg-background !text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                        <SelectItem value="image_choice">Image Choice</SelectItem>
                    </SelectContent>
                </Select>
            </div> -->
            <div>
                
                <label class="text-sm font-medium text-foreground mb-2 block">Question Text</label>
                <Textarea v-model="quizData.text" placeholder="Enter your question here..."
                    class="min-h-[100px] resize-none !bg-background" />
            </div>
            <!-- image here -->
            <div v-if="quizData.question_type === 'multiple_choice'">
                <label class="text-sm font-medium text-foreground mb-2 block">Question Image
                    (Optional)</label>
                <div class="flex gap-2">
                    <Input type="file" @change="onFileChange" class="!bg-background" />

                </div>
                <div class="mt-3 p-3 border rounded-lg bg-background">
                    <img :src="previewUrl || quizData.image || '/Website.png'" alt="Question preview"
                        class="max-w-full h-auto max-h-48 rounded mx-auto" />

                </div>
                <div class="flex justify-end mt-4 items-center gap-3">
                    <p v-if="toggleChange" class="text-green-500 text-sm">Save Success</p>
                    <Button @click="saveChanges">Save Changes</Button>
                </div>
            </div>
        </CardContent>
    </Card>
    <!-- Answer Options -->
    <Card v-if="quizData.question_type == 'multiple_choice'">
        <CardHeader>
            <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2">
                    Answer Options
                </CardTitle>
                <Button :disabled="quizData.options.length === 4"  size="sm" @click="addOption">
                    <Plus class="h-4 w-4" />
                    Add Option
                </Button>
            </div>
        </CardHeader>
        <CardContent class="space-y-3">
            <div v-for="(option, index) in quizData.options" :key="index"
                class="flex items-center gap-3 p-3 border rounded-lg bg-card">
                <div class="flex items-center gap-2">
                    <GripVertical class="h-4 w-4 text-muted-foreground cursor-move" />
                    <span class="text-sm font-medium text-muted-foreground min-w-[20px]">
                        {{ String.fromCharCode(65 + index) }}
                    </span>
                </div>

                <Input :placeholder="`Option ${String.fromCharCode(65 + index)}`" v-model="option.text"
                    class="flex-1" />
                <Button :variant="option.is_correct ? 'default' : 'outline'" size="sm"
                    @click="setCorrectAnswerMc(option.id)" class="gap-1 min-w-[80px]">
                    <template v-if="option.is_correct">
                        <Check class="h-3 w-3" />
                        Correct
                    </template>
                    <template v-else>
                        Mark
                    </template>
                </Button>

                <Button v-if="true" variant="outline" size="sm" @click="updateOption(option)"
                    class="text-blue-500 hover:text-accent/70">
                    Save Changes
                </Button>
                <Button v-if="true" variant="outline" size="sm" @click="removeOption(option.id)"
                    class="text-destructive hover:text-destructive">
                    <Trash2 class="h-4 w-4" />
                </Button>
            </div>
            <p class="text-xs text-muted-foreground mt-2">
                Max: 4 options. Minimum: 2 options.
            </p>
        </CardContent>
    </Card>


    <!-- Answer Options -->
    <Card v-else>
        <CardHeader>
            <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2">
                    Two Image Option
                </CardTitle>

            </div>

            <div v-if="quizData.options" class="flex gap-4 w-full mt-5">
                <div class="flex-1 cursor-pointer" @click="setCorrectAnswer('image1')">
                    <Input type="file" class="mb-5 !bg-background" @change="image1.onFileChange" />
                    <div class="py-10 rounded-2xl border-dashed border-4 transition-all flex justify-center items-center h-70"
                        :class="{ 'border-accent': quizanswer === 'image1' }">
                        <img v-if="quizData.options.length < 1" :src="image1.previewUrl.value" alt="" class="h-full object-cover">
                        <img v-else :src="quizData.options[0].image" alt="" class="h-full object-cover">
                    </div>
                    <p class="text-center mt-5" :class="quizanswer === 'image1' ? 'brightness-100' : 'brightness-50'">
                        Image
                        1</p>
                </div>
                <div class="flex-1 cursor-pointer" @click="setCorrectAnswer('image2')">
                    <Input type="file" class="mb-5 !bg-background" @change="image2.onFileChange" />
                    <div class="py-10 rounded-2xl border-dashed border-4 transition-all flex justify-center items-center h-70"
                        :class="{ 'border-accent': quizanswer === 'image2' }">
                        <img v-if="quizData.options.length < 2" :src="image2.previewUrl.value " alt="" class="h-full object-cover">
                        <img v-else :src="quizData.options[1].image" alt="" class="h-full object-cover">
                    </div>
                    <p class="text-center mt-5" :class="quizanswer === 'image2' ? 'brightness-100' : 'brightness-50'">
                        Image
                        2</p>
                </div>
            </div>
            <div class="flex justify-end mt-4"><Button @click="null"
                    :disabled="!image1.changeUpdate.value && !image2.changeUpdate.value">Save Image</Button></div>
        </CardHeader>
        <CardContent class="space-y-3">

        </CardContent>
    </Card>
</template>