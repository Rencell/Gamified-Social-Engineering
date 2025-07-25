<template>

    <div class="snap-start min-h-screen flex flex-col items-center justify-center ">
        <div class="w-full max-w-3xl space-y-6">
            <Card :class="['border-t-4 border-t-accent']">
                <CardContent class="p-8">
                    <LearningSection>
                        <LearningHeader>
                            <LearningSpan>Final test</LearningSpan>: Test with Scenarios
                        </LearningHeader>
                        <LearningBody>

                            Phishing attacks are one of the most common security challenges that people face today. This
                            quiz will test your ability to identify phishing attempts from legitimate websites.

                        </LearningBody>
                    </LearningSection>


                    <div class="flex w-full ">
                        <Button class="w-full">Start Quiz <ChevronRight></ChevronRight> </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import { Button } from '@/components/ui/button';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';


</script>