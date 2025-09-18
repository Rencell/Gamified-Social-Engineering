<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useContentStore } from '@/stores/content';
import { Plus } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import Story from './editable/story.vue'
import Mcq from './editable/mcq.vue'
import SidebarEdittable from './editable/sidebarEdittable.vue';

const props = defineProps<{
    questions: any[];
}>();

const index = ref(0)
const currentQuestion = computed(() => props.questions[index.value] || null);

const changeIndex = (newIndex: number) => {
    index.value = newIndex;
}
const emit = defineEmits(['update:questions']);
</script>

<template>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <story v-if="currentQuestion.type === 'story'" :question="currentQuestion" :index-number="index" />
    <mcq v-else :question="currentQuestion" />
    <!-- Sidebar -->
    <SidebarEdittable :questions="props.questions" :current-index="index" @update:current-index="changeIndex" />
</div>
</template>