<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useImageUrl } from '@/composables/useImageUrl';
import { useUploadContentQuiz } from '@/composables/useUploadContentQuiz';
import { useContentStore } from '@/stores/content';
import { Plus } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import SidebarEdittable from './sidebarEdittable.vue'

const contentStore = useContentStore();
const props = defineProps<{
    question: any;
    indexNumber: number;
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
                        <label class="text-sm font-medium text-foreground mb-2 block">Title</label>
                        <Input placeholder="Enter step title..." v-model="currentQuestion.title" />
                    </div>

                    <div>
                        <label class="text-sm font-medium text-foreground mb-2 block">Step Image (Optional)</label>
                        <div>
                            <div class="flex gap-2">
                                <Input type="file" @change="onFileChange" />

                            </div>
                            <div class="mt-3 p-3 border rounded-lg bg-muted/50">
                                <img :src="previewUrl || useImageUrl(currentQuestion.image) || '/placeholder.svg'"
                                    alt="Question preview" class="max-w-full h-auto max-h-48 rounded mx-auto" />

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
                        <Button variant="outline" size="sm" @click="currentQuestion.description.push('Text')"
                            class="gap-2 bg-transparent">
                            <Plus class="h-4 w-4" />
                            Add Story
                        </Button>
                    </div>

                    <div v-for="(value, index) in currentQuestion.description" :key="index">
                        <label class="text-sm font-medium text-foreground mb-2 block">Story</label>
                        <Textarea placeholder="Enter step description..." class="min-h-[100px] resize-none"
                            v-model="currentQuestion.description[index]" />
                    </div>
                </CardHeader>

            </Card>
        </div>

        
</template>