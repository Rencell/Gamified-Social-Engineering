<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-vue-next';
import { useContentStore } from '@/stores/content';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { defaultFinalTestProps, type FinalTestProps, defaultPropsMap } from './QuizRegistry';
import type { Question } from '@/services/assessmentService';
const props = defineProps<{
    questions: Question[];
    currentIndex: number;
}>();
const emit = defineEmits(['update:currentIndex', 'update:addQuestion','update:deleteQuestion']);

function selectQuestion(index: number) {
    emit('update:currentIndex', index);
}

function addQuestion(type: string) {
    emit('update:addQuestion', type);
}


const deleteQuestion = (index: number) => {
    emit('update:deleteQuestion', index);
    
};
</script>

<template>
    <div>
        <Card class="border-sidebar-border h-fit">
            <CardHeader>
                <CardTitle class="text-sidebar-foreground">Question Status</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
               
                <div v-for="(value, index) in questions" :key="index" class="space-y-2" >
                    <div class="flex justify-between text-sm hover:bg-ternary/10 rounded-lg cursor-pointer p-1"
                        :class="index === currentIndex ? 'bg-accent/50 font-medium p-2' : ''"
                        @click="selectQuestion(index)">
                        <span class="text-sidebar-foreground">Question #{{ index + 1 }}</span>
                        <Trash2 class="h-4 w-4 text-destructive hover:text-destructive hover:opacity-100"
                            @click.prevent="deleteQuestion(index)" />
                    </div>

                </div>

                <Button variant="default" class="w-full gap-2" size="sm" @click="addQuestion('mc')">    
                    <Plus class="h-4 w-4" />
                    Add Multiple Choice
                </Button>
                <Button variant="default" class="w-full gap-2" size="sm" @click="addQuestion('ic')">
                    <Plus class="h-4 w-4" />
                    Add Two Image Option
                </Button>
              
            </CardContent>
        </Card>
    </div>

</template>