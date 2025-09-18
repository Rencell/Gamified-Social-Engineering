<script setup lang="ts">
import { Button } from '@/components/ui/button';
import tailgaiting from '/Learning/Content/introToSocialEngineering/CommonAttacks/tailgating.png'
import LearningHeader from '../../content/UI/Learning/Core/LearningHeader.vue';
import LearningImage from '../../content/UI/Learning/Image/LearningImage.vue';
import LearningBody from '../../content/UI/Learning/Core/LearningBody.vue';
import LearningSection from '../../content/UI/Learning/Core/LearningSection.vue';
import type { Story } from './type';
import { useImageUrl } from '@/composables/useImageUrl';
import LearningBold from '../../content/UI/Learning/Highlight/LearningBold.vue';
const props = defineProps<{
    data: Story
}>();

const emit = defineEmits(['toggleNext'])
</script>

<template>
    <LearningSection class="flex items-center gap-4 w-lg">
        <LearningHeader>
            {{data.title}}
        </LearningHeader>
        <LearningImage :image="useImageUrl(data.image)!" />

        <LearningBody v-for="(value, index) in data.description" :key="index" class="text-center">
            <LearningBold :text="value"></LearningBold>
        </LearningBody>


        <Button @click="emit('toggleNext')">Next</Button>
    </LearningSection>
</template>