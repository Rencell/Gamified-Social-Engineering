<template>
    
        <ProgressHeader :current-index="currentIndex" :length="questions.length"/>
  
    <div :class="{'flex gap-4' : currentSelected.type === 'SMS'}" >
        <div >
            <Email v-if="currentSelected.type === 'EMAIL'"
                :from="currentSelected.email.from"
                :subject="currentSelected.email.subject"
                :link="currentSelected.email.link"
                :date="currentSelected.email.date"
                :body="currentSelected.email.body"
                :footer="''"
            >
            </Email>
            <Phone v-else
                :number="currentSelected.sms.number"
                :date="currentSelected.sms.date"
                :message="currentSelected.sms.message"
            >
            </Phone>
        </div>
        
       
        <Options 
            :key="currentIndex"
            :question="currentSelected.question"
            :options="currentSelected.options"
            :answer="currentSelected.answer"
            :single-grid="currentSelected.type === 'SMS'"
            @is-correct="isCorrect = true"
            @is-answered="isAnswered = true"
            class="pt-10"
         />
        
    </div>
        <ResultFooter 
            class="sticky" 
            :is-correct="isCorrect" 
            explanation="sdasas" 
            :is-answered="isAnswered"
            @toggle-next="handleNextQuestion"/>
</template>

<script setup lang="ts">
import type {PhishingEmailQuestion} from './type';
import { computed, ref } from 'vue';
import Phone from '../../FInalTest/phone.vue';
import Email from '../../FInalTest/email.vue'
import Options from '../../FInalTest/common/options.vue'
import ResultFooter from './common/resultFooter.vue'
import ProgressHeader from './common/ProgressHeader.vue'

const props = defineProps<{
    questions: PhishingEmailQuestion[];
}>();

const emit = defineEmits(['finish']);

const isCorrect = ref(false);
const isAnswered = ref(false);

const handleNextQuestion = () => {
    if(currentIndex.value >= props.questions.length - 1) {
        return;
    }
    currentIndex.value += 1;
    isCorrect.value = false;
    isAnswered.value = false;
}
const currentIndex = ref(0);
const currentSelected = computed(() => {
    return props.questions[currentIndex.value];
});



</script>