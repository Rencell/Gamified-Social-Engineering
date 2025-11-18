<script setup lang="ts">
import AssessmentCard from '@/components/Assessment/AssessmentCard.vue'
import { onMounted, ref } from 'vue';
import AddItems from '@/components/Assessment/dialog/addItems.vue'
import { useAssessmentStore } from '@/stores/assessment';


const assessmentsStore = useAssessmentStore();
onMounted(async () => {
    await assessmentsStore.fetch();
});

</script>
<template>
    <p class="font-bold text-3xl mb-4">Assessment</p>
    <AddItems />
    <div class="grid grid-cols-2 gap-4 p-4">
        <div v-for="(value, index) in assessmentsStore.assessments" :key="index">
        
            <RouterLink :to="{ name: 'AssessmentDetail', params: { id: value.slug } }">
                
                <AssessmentCard 
                    :id="value.id"
                    :image="value.image ?? 'image not set'" 
                    :bg="value.bg ?? 'bg-purple-700'" 
                    :description="value.description" 
                    :name="value.name" 
                    :progress="10" 
                    :duration="value.duration ?? 0" 
                    :questions="value.question_count ?? 0" />
            </RouterLink>
        </div>
        <div v-if="assessmentsStore.assessments.length === 0" class="col-span-2 text-center text-gray-500">
            No assessments available.
        </div>
    </div>
</template>