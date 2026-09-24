<script setup lang="ts">
import AssessmentCard from '@/components/Assessment/AssessmentCard.vue'
import { onMounted, ref } from 'vue';
import AddItems from '@/components/Assessment/dialog/addItems.vue'
import { useAssessmentStore } from '@/stores/assessment';
import Loading from '@/components/loading.vue';
import { useAuthStore } from '@/stores/auth';


const assessmentsStore = useAssessmentStore();
const authStore = useAuthStore();
const isLoading = ref(true);
const requiredLevel = ref(0);
    
onMounted(async () => {
    isLoading.value = true;
    try {
        await assessmentsStore.fetch();
    } finally {
        isLoading.value = false;
    }
});


onMounted(async () => {
    requiredLevel.value = await authStore.User.level;
});

</script>
<template>
    <p class="font-bold text-3xl mb-4">Assessment </p>
    <AddItems />
    <Loading v-if="isLoading"/>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">

        <div v-for="(value, index) in assessmentsStore.assessments" :key="index">
        
            <RouterLink :to="{ name: 'AssessmentDetail', params: { id: value.slug } }">
                
                <AssessmentCard 
                    :id="value.id"
                    :image="String(value.image) ?? 'image not set'" 
                    :bg="value.bg ?? 'bg-purple-700'" 
                    :description="value.description" 
                    :name="value.name" 
                    :progress="10" 
                    :duration="value.duration ?? 0" 
                    :questions="value.question_count ?? 0"
                    :required-level="value.required_level ?? 0"
                    :isUnlocked="(value.required_level ?? 0) <= requiredLevel" />
            </RouterLink>
        </div>

        <div v-if="assessmentsStore.assessments.length === 0 && !isLoading" class="col-span-2 text-center text-gray-500">
            No assessments available.
        </div>
    </div>
</template>