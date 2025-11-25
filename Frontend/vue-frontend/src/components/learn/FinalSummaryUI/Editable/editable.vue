<script setup lang="ts">
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, ImageIcon, Plus, Check, Trash2 } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import SidebarEdittable from '../../QuizUI/SidebarEdittable.vue';
import MultipleChoice from './MultipleChoice.vue'
import TwoImage from './TwoImage.vue'
import TrueFalse from './TrueFalse.vue'
import Email from './email.vue'
import Sms from './sms.vue'


const props = defineProps<{
    questions: any[];
}>();

const currentIndex = ref(0);
const quizData = computed(() => props.questions[currentIndex.value] || null);



defineEmits(['toggleOnCreateQuestion', 'toggleOnDeleteQuestion', 'toggleOnCreateFinalQuestion']);

</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content Area -->

        <div class="lg:col-span-2 space-y-6">
            <MultipleChoice v-if="quizData.type === 'multiple-choice'" :question="quizData"/>
            <TwoImage v-else-if="quizData.type === 'two-image'" :question="quizData" />
            <TrueFalse v-else-if="quizData.type === 'true-false'" :question="quizData" />
            <Email v-else-if="quizData.type === 'email'" :question="quizData" />
            <Sms v-else :question="quizData" />
        </div>

        <!-- Sidebar -->
        <SidebarEdittable
            :propsMap="null"
            :questions="props.questions"
            :currentIndex="currentIndex"
            :isFinal="true"
            @update:currentIndex="currentIndex = $event"
        />
    </div>
</template>