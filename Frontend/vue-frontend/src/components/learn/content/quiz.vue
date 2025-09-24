<script setup lang="ts">
import { componentMap, editableComponentMap, defaultPropsMap, defaultFinalTestProps } from '@/components/learn/QuizUI/QuizRegistry.ts';
import type { FinalTestProps, QuizType } from '@/components/learn/QuizUI/QuizRegistry.ts';
import { computed, onMounted, ref } from 'vue';
import QuizEdit from './quizEdit.vue'
import { useModuleStore } from '@/stores/module';
import { useRoute } from 'vue-router';
import { useContentStore } from '@/stores/content';
import LearningContent from './UI/Learning/Core/LearningContent.vue';

interface QuizQuestion {
    id: number;
    quiz_limit?: number;
    type: QuizType;
    props: Record<string, any>; // You can expand this to include other quiz types
}

const contentItems = ref<QuizQuestion>({
    id: 0,
    quiz_limit: 1,
    type: 'ModuleReward',
    props: [],
});

const props = defineProps<{
    content_order: number;
    totalLength: number;
}>();

// alert(props.content_order);
const route = useRoute();
const moduleStore = useModuleStore();
const contentStore = useContentStore();
onMounted(async () => {
    await moduleStore.fetchModules(route.params.lessonId as string);
    await contentStore.fetchContentQuiz(moduleStore.selectedModule?.id as number);
    contentItems.value = contentStore.contentItems;
})

const Question = computed(() => contentItems.value);


function addQuestion() {
    const type = Question.value.type as QuizType;
    
    const newQuestion = JSON.parse(JSON.stringify(defaultPropsMap[type]));
    
    Question.value.props.push(newQuestion);
}

function addFinalQuestion(finalQuizType: keyof FinalTestProps)   {

    const type = finalQuizType;
    const newQuestion = JSON.parse(JSON.stringify(defaultFinalTestProps[type]));
    Question.value.props.push(newQuestion);
} 

function changeQuestionType(newType: QuizType) {
    if (newType === 'ScenarioTraining'){ 
        Question.value.type = newType;
        Question.value.props = [defaultPropsMap['ScenarioTraining'].Story as any];
    }
    else{
        Question.value.type = newType;
        Question.value.props = [defaultPropsMap[newType] as any];

    }

}

function deleteQuestion(index: number) {
    if (Question.value.props.length > 1) {
        alert(index)
        Question.value.props.splice(index, 1); 
    } else {
        alert("You must have at least one question.");
    }
}
</script>
<template>
    <LearningContent>
        <QuizEdit 
        :questions="Question.props" 
        :quizComponent="componentMap[Question.type as QuizType]"
        :editableComponent="editableComponentMap[Question.type as QuizType]" 
        :quiz-limit="contentItems.quiz_limit"
        :quizType="Question.type as QuizType"
            @onCreateQuestion="addQuestion"
            @onCreateFinalQuestion="addFinalQuestion($event)"
            @onDeleteQuestion="deleteQuestion($event)"
            @onChangeQuestionType="changeQuestionType($event)" />
            
    </LearningContent>

</template>