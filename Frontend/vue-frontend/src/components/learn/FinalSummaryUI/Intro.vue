<template>

    <LearningContent>
        <div class="w-full space-y-6">
            <Card :class="['border-t-4 border-t-accent']">
                <CardContent class="p-8">
                        <LearningHeader class="text-center">
                            <LearningSpan>Final test</LearningSpan>: {{ sectionStore.selectedSection?.name }}
                        </LearningHeader>
                        <LearningBody class="text-center">

                            Ready for a challenge? Test your growing knowledge and skills.

                        </LearningBody>
                        <LearningBody>
                            
                            <Card class="bg-background/50 border-2 border-ternary w-full sm:w-xl">
                                <CardContent class="flex flex-col gap-5">
                                    <p class="flex gap-2 items-center">
                                        <Zap class="size-5 text-accent"></Zap>Level Requirements
                                    </p>

                                    <div class="text-sm space-y-4 font-bold">
                                        <div class="flex justify-between">
                                            <p>Time:</p>
                                            <p>15:00 mins</p>
                                        </div>
                                        <div class="flex justify-between">
                                            <p>Passing Score:</p>
                                            <p class="text-accent">75%</p>
                                        </div>
                                        <div class="flex justify-between">
                                            <p>Questions:</p>
                                            <p>{{useContentStore().contentItems.quiz_limit}} Questions</p>
                                        </div>
                                        <div class="flex justify-between">
                                            <p>Advanced to:</p>
                                            <p class="text-accent">Phishing</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </LearningBody>

                    <div class="flex w-full ">
                        <Button class="w-full" @click="toggleStart">Start Test <ChevronRight>
                            </ChevronRight> </Button>
                    </div>
                </CardContent>
            </Card>
        </div>


    </LearningContent>

</template>

<script setup lang="ts">
import { ChevronRight, Zap } from 'lucide-vue-next';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import image from '/Human.webp'
import image2 from '/Phishing.webp'
import LearningContent from '../content/UI/Learning/Core/LearningContent.vue';
import LearningSection from '../content/UI/Learning/Core/LearningSection.vue';
import LearningHeader from '../content/UI/Learning/Core/LearningHeader.vue';
import LearningSpan from '../content/UI/Learning/Highlight/LearningSpan.vue';
import LearningBody from '../content/UI/Learning/Core/LearningBody.vue';
import LearningList from '../content/UI/Learning/Listing/LearningList.vue';
import { Button } from '@/components/ui/button';
import { onMounted, ref } from 'vue';
import { useSectionStore } from '@/stores/sections';
import { useContentStore } from '@/stores/content';


const emit = defineEmits(['startQuiz']);

const loading = ref(false);
const toggleStart = () => {
    loading.value = true;

    setTimeout(() => {
        loading.value = false;
        emit('startQuiz');
    }, 1000);
}
const sectionStore= useSectionStore();

</script>