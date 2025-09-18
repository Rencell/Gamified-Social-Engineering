<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useImageUrl } from '@/composables/useImageUrl';
import { useUploadContentQuiz } from '@/composables/useUploadContentQuiz';
import { useContentStore } from '@/stores/content';
import { Plus, Trash2 } from 'lucide-vue-next';
import { computed, ref } from 'vue';

const contentStore = useContentStore();
const props = defineProps<{
    question: any;
}>();

const currentQuestion = computed(() => props.question || null);

const { previewUrl, changeUpdate, onFileChange, uploadImage } = useUploadContentQuiz();
async function handleUpload() {
    await uploadImage(
        { item: { id: contentStore.contentItems.id }, image: currentQuestion.value.image },
        (data) => {
            currentQuestion.value.image = data.image;
        }
    );
    await contentStore.updateContentsQuiz();
}

function addOption() {
    if (currentQuestion.value.options.length >= 4) return; // Limit to 4 options
    const nextId = String.fromCharCode(97 + currentQuestion.value.options.length); // Generate 'a', 'b', 'c', etc.
    currentQuestion.value.options.push({ id: nextId, text: '' });
}
</script>

<template>
        <!-- Main Content Area -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Step Content -->
            <Card class="bg-background">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        Step Content
                        <Badge variant="secondary" class="text-xs">
                            Required
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-foreground mb-2 block">Question</label>
                        <Input placeholder="Enter step title..." v-model="currentQuestion.question" />
                    </div>

                    <div>
                        <label class="text-sm font-medium text-foreground mb-2 block">Image (Optional)</label>
                        <div>
                            <div class="flex gap-2">
                                <Input type="file" @change="onFileChange" />

                            </div>
                            <div class="mt-3 p-3 border rounded-lg bg-muted/50">
                                <img :src="previewUrl || useImageUrl(currentQuestion.image) || '/placeholder.svg'"
                                    alt="Question preview" class="max-w-full h-auto max-h-48 rounded mx-auto" />

                            </div>

                            <label class="text-sm font-medium text-foreground my-2 block">Set image position (default: left)</label>
                            <div class="grid grid-cols-2 gap-2 mt-2">
                                <Button @click="currentQuestion.position = 'left'" :variant="currentQuestion.position === 'left' ? 'default' : 'outline'" size="sm">
                                    Left
                                </Button>
                                <Button @click="currentQuestion.position = 'right'" :variant="currentQuestion.position === 'right' ? 'default' : 'outline'" size="sm">
                                    Right
                                </Button>
                            </div>


                            <div class="flex justify-end mt-4"><Button @click="handleUpload"
                                    :disabled="!changeUpdate">Save
                                    Image</Button></div>
                        </div>

                    </div>
                </CardContent>
            </Card>

            <!-- Answer Options (if MCQ) -->
            <Card class="bg-background">
                <CardHeader>
                    <div class="flex items-center justify-between">
                        <CardTitle class="flex items-center gap-2">
                            Scenario Script
                            <Badge variant="secondary" class="text-xs">
                                options
                            </Badge>
                        </CardTitle>
                        <Button :disabled="currentQuestion.options.length >= 4" variant="outline" size="sm" @click="addOption"
                            class="gap-2 bg-transparent">
                            <Plus class="h-4 w-4" />
                            Add Option
                        </Button>
                    </div>

                </CardHeader>

                <CardContent class="space-y-3">
                    <div v-for="(option, index) in currentQuestion.options" :key="option.id"
                        class="flex items-center gap-3 p-3 border rounded-lg bg-card">
                        <div class="flex items-center gap-2">
                            <GripVertical class="h-4 w-4 text-muted-foreground cursor-move" />
                            <span class="text-sm font-medium text-muted-foreground min-w-[20px]">
                                {{ String.fromCharCode(65 + index) }}
                            </span>
                        </div>

                        <Input :placeholder="`Option ${String.fromCharCode(65 + index)}`" v-model="option.text"
                            class="flex-1" />
                        
                        <Button @click="currentQuestion.answer = option.id" :variant="currentQuestion.answer === option.id ? 'default' : 'outline'" size="sm"
                            class="gap-1 min-w-[80px]">
                            <template v-if="currentQuestion.answer === option.id">
                                <Check class="h-3 w-3" />
                                Correct
                            </template>
                            <template v-else>
                                Mark
                            </template>
                        </Button>

                        <Button v-if="currentQuestion.options.length > 2" variant="outline" size="sm"
                             class="text-destructive hover:text-destructive">
                            <Trash2 class="h-4 w-4" />
                        </Button>
                    </div>
                    <p class="text-xs text-muted-foreground mt-2">
                        Max: 4 options. Minimum: 2 options.
                    </p>
                </CardContent>
            </Card>

            <Card class="bg-background">
                <CardHeader>
                    <div class="flex items-center justify-between">
                        <CardTitle class="flex items-center gap-2">
                            Explanation
                            <Badge variant="secondary" class="text-xs">
                                options
                            </Badge>
                        </CardTitle>
                    </div>

                </CardHeader>

                <CardContent>
                    <div>
                        <label class="text-sm font-medium text-foreground mb-2 block">Answer Explanation</label>
                        <Textarea placeholder="Explain why this is the correct answer..." v-model="currentQuestion.explanation"
                            class="min-h-[120px] resize-none" />
                        <p class="text-xs text-muted-foreground mt-2">
                            This explanation will be shown to students after they answer the question.
                        </p>
                    </div>
                </CardContent>
                
            </Card>

            {{ currentQuestion }}
        </div>

</template>