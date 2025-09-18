<script setup lang="ts">
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, ImageIcon, Plus, Check, Trash2 } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { useUploadContentQuiz } from '@/composables/useUploadContentQuiz';
import { useImageUrl } from '@/composables/useImageUrl';
import { useContentStore } from '@/stores/content';
const contentStore = useContentStore();

const { previewUrl, changeUpdate, onFileChange, uploadImage } = useUploadContentQuiz();

const props = defineProps<{
    question: any;
}>();

const quizData = ref(props.question)

function setCorrectAnswer(id: string) {
    quizData.value.answer = id;
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

    <Card class="bg-background">
        <CardHeader>
            <CardTitle class="flex items-center gap-2">
                Question Content
            </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
            <div>
                <label class="text-sm font-medium text-foreground mb-2 block">Question</label>
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
                    True or False
                </CardTitle>
            </div>
        </CardHeader>
        <CardContent class="space-y-3">
            <div v-for="(option, index) in ['True', 'False']" :key="index"
                class="flex items-center gap-3 p-3 border rounded-lg bg-card">
                <div class="flex items-center gap-2">
                    <GripVertical class="h-4 w-4 text-muted-foreground cursor-move" />
                </div>

                {{ option }}

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

    <!-- Explanation -->
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