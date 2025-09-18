<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, ImageIcon, Plus, Check, Trash2 } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { ref } from 'vue';
import type { FinalTestProps } from '../../QuizUI/QuizRegistry';
import { useUploadContentQuiz } from '@/composables/useUploadContentQuiz';
import { useImageUrl } from '@/composables/useImageUrl';
import { useContentStore } from '@/stores/content';

const contentStore = useContentStore();

const image1 = useUploadContentQuiz();
const image2 = useUploadContentQuiz();

const props = defineProps<{
    question: any;
}>();

const quizData = ref(props.question)

function setCorrectAnswer(id: "image1" | "image2") {
    quizData.value.answer = id;
}

async function handleUploadImage1() {
    await image1.uploadImage(
        { item: { id: contentStore.contentItems.id }, image: quizData.value.image1 },
        (data) => {
            quizData.value.image1 = data.image;
        }
    );
    
}

async function handleUploadImage2() {
    await image2.uploadImage(
        { item: { id: contentStore.contentItems.id }, image: quizData.value.image2 },
        (data) => {
            quizData.value.image2 = data.image;
        }
    );
}

const saveHandler = async() => {
    await handleUploadImage1();
    await handleUploadImage2();
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

        </CardContent>
    </Card>

    <!-- Answer Options -->
    <Card class="bg-background">
        <CardHeader>
            <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2">
                    Two Image Option
                </CardTitle>
                
            </div>
            
            <div class="flex gap-4 w-full mt-5">
                <div class="flex-1 cursor-pointer" @click="setCorrectAnswer('image1')">
                    <Input type="file" class="mb-5" @change="image1.onFileChange" />
                    <div class="py-10 rounded-2xl border-dashed border-4 transition-all flex justify-center items-center h-70" :class="{'border-accent': quizData.answer === 'image1'}">
                        <img :src="image1.previewUrl.value || useImageUrl(quizData.image1) || '/Website.png'" alt="" class="h-full object-cover">
                    </div>
                    <p class="text-center mt-5" :class="quizData.answer === 'image1' ? 'brightness-100' : 'brightness-50'">Image 1</p>
                </div>
                <div class="flex-1 cursor-pointer" @click="setCorrectAnswer('image2')">
                    <Input type="file" class="mb-5" @change="image2.onFileChange" />
                    <div class="py-10 rounded-2xl border-dashed border-4 transition-all flex justify-center items-center h-70" :class="{'border-accent': quizData.answer === 'image2'}">
                        <img :src="image2.previewUrl.value || useImageUrl(quizData.image2) || '/Website.png'" alt="" class="h-full object-cover">
                    </div>
                    <p class="text-center mt-5" :class="quizData.answer === 'image2' ? 'brightness-100' : 'brightness-50'">Image 2</p>
                </div>
            </div> 
            <div class="flex justify-end mt-4"><Button @click="saveHandler" :disabled="!image1.changeUpdate.value && !image2.changeUpdate.value">Save Image</Button></div>
        </CardHeader>
        <CardContent class="space-y-3">
           
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