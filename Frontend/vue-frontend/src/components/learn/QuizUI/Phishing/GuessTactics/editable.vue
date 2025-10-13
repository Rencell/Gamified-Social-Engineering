<script setup lang="ts">
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, ImageIcon, Plus, Check, Trash2, Eye } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import SidebarEdittable from '../../SidebarEdittable.vue';
import { useUploadContentQuiz } from '@/composables/useUploadContentQuiz';
import { useContentStore } from '@/stores/content';
import { useImageUrl } from '@/composables/useImageUrl';
import { defaultPropsMap } from '../../QuizRegistry';

const props = defineProps<{
    questions: any[];
}>();

const currentIndex = ref(0);
const currentQuestion = computed(() => props.questions[currentIndex.value] || null);

const togglePreview = ref(false);
const togglePreviewContent = () => {
    togglePreview.value = !togglePreview.value;
};

function addOption() {
    if (currentQuestion.value.options.length >= 4) return; // Limit to 4 options
    const nextId = String.fromCharCode(97 + currentQuestion.value.options.length); // Generate 'a', 'b', 'c', etc.
    currentQuestion.value.options.push({ id: nextId, text: '' });
}

function removeOption(id: string) {
    if (currentQuestion.value.options.length > 2) {
        currentQuestion.value.options = currentQuestion.value.options.filter((option: { id: string; }) => option.id !== id);
    }
}

function setCorrectAnswer(id: string) {
    currentQuestion.value.correctAnswer = id;
}

</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">

            <div class="flex items-center justify-center space-x-4 mb-6 font-display">
                <div v-if="currentQuestion.type == 'email'" class="bg-[#f6f6f6] p-4 rounded-xl relative">
                    <div class="absolute top-4 right-4">
                        <Eye class="text-black" @click="togglePreviewContent" />
                    </div>
                    <div class="flex justify-between ">
                        <div class="flex items-center gap-5">
                            <div class="p-2 py-1 rounded-md h-fit bg-black text-blue-400">m</div>
                            <div class="flex gap-2 flex-col font-secondary mb-4 text-background font-medium text-sm">
                                <!-- <h1>{{ currentQuestion.sender }}</h1> -->
                                <Input v-if="!togglePreview" v-model="currentQuestion.sender"
                                    class="w-full max-w-sm"></Input>
                                <Textarea v-if="!togglePreview" v-model="currentQuestion.subject"
                                    class="w-full max-w-sm"></Textarea>
                                <h1 v-if="togglePreview">{{ currentQuestion.sender }}</h1>
                                <h2 v-if="togglePreview">{{ currentQuestion.subject }}</h2>
                            </div>
                        </div>

                        <div class="place-content-center text-xs text-background">{{ currentQuestion.date }}</div>
                    </div>

                    <div class="p-5  bg-white rounded-lg border-1 border-black/40 shadow-xl motion-preset-fade">
                        <div class="py-4 text-black text-sm flex flex-col gap-3">
                            <template v-for="(value, index) in currentQuestion.content" :key="index">
                                <div v-if="value.charAt(0) === '#' " class="flex gap-3 w-full items-start">
                                    <a v-if="togglePreview" :href="currentQuestion.link"
                                        class="bg-yellow-400 text-black px-4 py-2 w-fit rounded">
                                        {{ value.trim().substring(1) }}
    
                                    </a>

                                    <Input v-if="!togglePreview" v-model="currentQuestion.content[index]"></Input>
                                    <Input v-if="!togglePreview" v-model="currentQuestion.link"></Input>
                                    <Trash2 v-if="!togglePreview" class="text-red-500 size-10"
                                        @click="currentQuestion.content.splice(index, 1)"></Trash2>
                                </div>

                                <!-- <p v-else>{{ value }}</p> -->
                                <div v-else class="flex gap-3">
                                    <Textarea v-if="!togglePreview" v-model="currentQuestion.content[index]"></Textarea>
                                    <Trash2 v-if="!togglePreview" class="text-red-500 size-4"
                                        @click="currentQuestion.content.splice(index, 1)"></Trash2>
                                    <p v-if="togglePreview">{{ value }}</p>
                                </div>
                            </template>
                            <Button v-if="!togglePreview" @click="currentQuestion.content.push('sdsa')">Add
                                Content</Button>
                        </div>

                    </div>
                </div>
            </div>
            <!-- Options Card -->
            <Card class="bg-background">
                <CardHeader>
                    <div class="flex items-center justify-between">
                        <CardTitle class="flex items-center gap-2">
                            Answer Options
                            <Badge variant="secondary" class="text-xs">
                                {{ currentQuestion.options.length }} options
                            </Badge>
                        </CardTitle>
                        <Button :disabled="currentQuestion.options.length === 4" variant="outline" size="sm"
                            @click="addOption" class="gap-2 bg-transparent">
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

                        <Button :variant="currentQuestion.correctAnswer === option.id ? 'default' : 'outline'" size="sm"
                            @click="setCorrectAnswer(option.id)" class="gap-1 min-w-[80px]">
                            <template v-if="currentQuestion.correctAnswer === option.id">
                                <Check class="h-3 w-3" />
                                Correct
                            </template>
                            <template v-else>
                                Mark
                            </template>
                        </Button>

                        <Button v-if="currentQuestion.options.length > 2" variant="outline" size="sm"
                            @click="removeOption(option.id)" class="text-destructive hover:text-destructive">
                            <Trash2 class="h-4 w-4" />
                        </Button>
                    </div>
                    <p class="text-xs text-muted-foreground mt-2">
                        Max: 4 options. Minimum: 2 options.
                    </p>
                </CardContent>
            </Card>
        </div>

        <SidebarEdittable :questions="props.questions" :currentIndex="currentIndex"
            @update:currentIndex="currentIndex = $event" :propsMap="defaultPropsMap.PhishingTactics" />
    </div>
</template>