<template>
    
    <LearningContent>
        <div class="w-full max-w-2xl space-y-6">
            <Card :class="['border-t-4 border-t-accent']">
                <CardContent class="p-8">
                    <LearningSection class="w-full">
                        <LearningHeader>
                            <LearningSpan>Final test</LearningSpan>: Let's test your knowledge!
                        </LearningHeader>
                        <LearningBody>

                            Let's see how much you've learned! You have to get at least 80% to pass the test and unlock
                            the next course.

                        </LearningBody>
                        <LearningBody>
                            <LearningSpan>This will unlock:</LearningSpan>
                            <LearningList>
                                <Card class="bg-background border-2 border-ternary">
                                    <CardContent class="flex items-center gap-5">
                                        <div class="h-20 w-20 rounded-full  flex justify-center items-center">
                                            <div class="absolute w-20 h-20 rounded-full bg-accent/30 blur-lg"></div>
                                            <img class="relative size-20 object-contain" :src="image2" alt="">
                                        </div>
                                        <p>Get 80% or higher on the final test to unlock the Phishing course.</p>
                                    </CardContent>
                                </Card>
                                <Card class="bg-background border-2 border-ternary">
                                    <CardContent class="flex items-center gap-5">
                                        <div class="h-20 w-20 rounded-full  flex justify-center items-center">
                                            <div class="absolute w-20 h-20 rounded-full bg-accent/30 blur-lg"></div>
                                            <img class="relative size-20 object-contain" :src="image" alt="">
                                        </div>
                                        <p>You will unlock Social Engineering Badge</p>
                                    </CardContent>
                                </Card>

                            </LearningList>
                        </LearningBody>
                    </LearningSection>

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
import { ChevronRight } from 'lucide-vue-next';
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


const emit = defineEmits(['startQuiz']);

const loading = ref(false);
const toggleStart = () => {
    loading.value = true;

    setTimeout(() => {
        loading.value = false;
        emit('startQuiz');
    }, 1000);
}

</script>