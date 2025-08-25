<template>

    <LearningContent>
        <LearningSection>
            <LearningHeader>
                The Art of Manipulation
            </LearningHeader>
            <LearningImage2 :image="content3_assets" />


            <InteractiveMCQ :mcq="mcq" @showDown="emit('showDown', true)">
                <template #lesson>
                    <LearningSection>
                        <LearningHeader>
                            Curiosity
                        </LearningHeader>
                        <LearningBody>
                            Humans are naturally curious beings. We want to know more about the world around us, and
                            this. The example image shows a seemingly a pretty lady could potentially hook you into
                            plugging
                            the USB. The attack is known as <LearningSpan>Baiting Attack</LearningSpan>, where an
                            attacker leaves a USB drive in a public place, hoping someone will plug it into their
                            computer.

                        </LearningBody>

                        <LearningBody>
                            <LearningSpanWrong>Of course beautiful, I’ll plug it into my computer right now and see
                                what’s inside.</LearningSpanWrong>
                        </LearningBody>

                        <LearningBody>
                            Attraction can also be used to persuade someone. However, you should never plug in
                            unknown devices. Always be cautious and avoid accepting or using devices from people you
                            don’t fully trust.
                        </LearningBody>

                        <LearningBody>
                            <LearningSpanCorrect>Sorry, I can’t plug in unknown devices. Let’s turn this over to IT so
                                they can handle it safely.</LearningSpanCorrect>
                        </LearningBody>

                        <LearningBody>
                            Always report suspicious devices to IT — they’ll check if it’s safe.
                        </LearningBody>

                        <LearningBody>
                            <LearningSpanWrong>Maybe later, I’m busy right now. But I’ll check it when I get a chance.
                            </LearningSpanWrong>
                        </LearningBody>

                        <LearningBody>

                        </LearningBody>

                    </LearningSection>
                </template>
            </InteractiveMCQ>
        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import InteractiveMCQ from '../../UI/Interactive/InteractiveMCQ.vue';
import type { MCQ } from '../../UI/Interactive/types';
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue';
import content3_assets from '/Learning/Content/introToSocialEngineering/PsychologySocialEngineering/content_3.webp';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';
import LearningSpanCorrect from '../../UI/Learning/Highlight/LearningSpanCorrect.vue';
import LearningSpanWrong from '../../UI/Learning/Highlight/LearningSpanWrong.vue';

const emit = defineEmits(['showDown']);

const mcq: MCQ = {
    question: "What would you reply in this situation?",
    options: [
        { id: 'A', text: 'Of course beautiful, I’ll plug it into my computer right now and see what’s inside.' },
        { id: 'B', text: 'Sorry, I can’t plug in unknown devices. Let’s turn this over to IT so they can handle it safely.' },
        { id: 'C', text: 'Maybe later, I’m busy right now. But I’ll check it when I get a chance.' }
    ],
    correctAnswer: 'B'
};

onMounted(() => {
    emit('showDown', false);
});
</script>