<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, ImageIcon, Plus, Check, Trash2 } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { computed, onMounted, ref } from 'vue';

import { useContentStore } from '@/stores/content';
import { useImageUrl } from "@/composables/useImageUrl";
import { useUploadContentQuiz } from '@/composables/useUploadContentQuiz';

const { previewUrl, changeUpdate, onFileChange, uploadImage } = useUploadContentQuiz();
const contentStore = useContentStore();
const props = defineProps<{
    question: any;
}>();

const quizData = computed(() => props.question);


function addOption() {
    if (quizData.value.options.length >= 4) return; // Limit to 4 options
    const nextId = String.fromCharCode(97 + quizData.value.options.length); // Generate 'a', 'b', 'c', etc.
    quizData.value.options.push({ id: nextId, text: '' });
}

function removeOption(id: string) {
    if (quizData.value.options.length > 2) {
        quizData.value.options = quizData.value.options.filter((option: { id: string }) => option.id !== id);
    }
}

function setCorrectAnswer(id: string) {
    quizData.value.correctAnswer = id;
}

function hideImage() {
    quizData.value.image = '';
}

async function handleUpload() {
    await uploadImage(
        { item: { id: contentStore.contentItems.id }, image: quizData.value.image },
        (data) => {
            quizData.value.image = data.image;
        }
    );
    contentStore.updateContentsQuiz();
}
</script>

<template>
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
                <label class="text-sm font-medium text-foreground mb-2 block">Question Text</label>
                <Textarea placeholder="Enter your question here..." v-model="quizData.question"
                    class="min-h-[100px] resize-none" />
            </div>

            <div>
                <label class="text-sm font-medium text-foreground mb-2 block">Question Image
                    (Optional)</label>
                <div class="flex gap-2">
                    <Input type="file" @change="onFileChange" />
                    
                </div>
                <div class="mt-3 p-3 border rounded-lg bg-muted/50">
                    <img :src="previewUrl || useImageUrl(quizData.image) || '/Website.png'" alt="Question preview"
                        class="max-w-full h-auto max-h-48 rounded mx-auto" @error="hideImage" />

                </div>

                <div class="flex justify-end mt-4"><Button @click="handleUpload" :disabled="!changeUpdate">Save Image</Button></div>
            </div>
        </CardContent>
    </Card>

    <!-- Answer Options -->
    <Card class="bg-background">
        <CardHeader>
            <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2">
                    Answer Options
                    <Badge variant="secondary" class="text-xs">
                        {{ quizData.options.length }} options
                    </Badge>
                </CardTitle>
                <Button :disabled="quizData.options.length === 4" variant="outline" size="sm" @click="addOption"
                    class="gap-2 bg-transparent">
                    <Plus class="h-4 w-4" />
                    Add Option
                </Button>
            </div>
        </CardHeader>
        <CardContent class="space-y-3">
            <div v-for="(option, index) in quizData.options" :key="option.id"
                class="flex items-center gap-3 p-3 border rounded-lg bg-card">
                <div class="flex items-center gap-2">
                    <GripVertical class="h-4 w-4 text-muted-foreground cursor-move" />
                    <span class="text-sm font-medium text-muted-foreground min-w-[20px]">
                        {{ String.fromCharCode(65 + index) }}
                    </span>
                </div>

                <Input :placeholder="`Option ${String.fromCharCode(65 + index)}`" v-model="option.text"
                    class="flex-1" />

                <Button :variant="quizData.correctAnswer === option.id ? 'default' : 'outline'" size="sm"
                    @click="setCorrectAnswer(option.id)" class="gap-1 min-w-[80px]">
                    <template v-if="quizData.correctAnswer === option.id">
                        <Check class="h-3 w-3" />
                        Correct
                    </template>
                    <template v-else>
                        Mark
                    </template>
                </Button>

                <Button v-if="quizData.options.length > 2" variant="outline" size="sm" @click="removeOption(option.id)"
                    class="text-destructive hover:text-destructive">
                    <Trash2 class="h-4 w-4" />
                </Button>
            </div>
            <p class="text-xs text-muted-foreground mt-2">
                Max: 4 options. Minimum: 2 options.
            </p>
        </CardContent>
    </Card>

    <!-- Explanation Section -->
    <Card class="bg-background">
        <CardHeader>
            <CardTitle>Explanation</CardTitle>
        </CardHeader>
        <CardContent>
            <div>
                <label class="text-sm font-medium text-foreground mb-2 block">Answer Explanation</label>
                <Textarea placeholder="Explain why this is the correct answer..." v-model="quizData.explanation"
                    class="min-h-[120px] resize-none" />
                <p class="text-xs text-muted-foreground mt-2">
                    This explanation will be shown to students after they answer the question.
                </p>
            </div>
        </CardContent>
    </Card>
</template>