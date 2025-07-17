<template>
    <div class="snap-center min-h-screen flex flex-col items-center justify-center">
        <LearningContent>

            <LearningImage :image="content2_assets" />
            <LearningSection>
                <LearningHeader>
                    <LearningSpan>Incident</LearningSpan>: I Love You virus
                </LearningHeader>
                <LearningBody>
                    The I Love You virus, was a computer worm that spread through email in
                    May 2000. Causing an estimated $10 billion in damages worldwide. It was one of the most damaging
                    computer viruses in history
                </LearningBody>

                <LearningBody>
                    Technically, The I Love You virus was a social engineering attack that tricked people into opening
                    an email attachment disguised as a love letter.
                </LearningBody>

                <LearningBody>
                    This says that individuals are often carried away by emotions and forgets caution, as many of us are
                    not really tech-savvy, criminals take advantage of this.
                </LearningBody>

                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Trust</AccordionTrigger>
                        <AccordionContent>
                            Trust is a fundamental aspect of human relationships, and attackers exploit this by
                            creating a false sense of trust. They may impersonate someone you know or create a fake
                            identity to gain your confidence.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Fear and urgency</AccordionTrigger>
                        <AccordionContent>
                            Fear and urgency are powerful motivators. It push you into making quick decisions without
                            thinking. For example, they might claim that your account will be locked unless you take
                            immediate action.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Curiosity</AccordionTrigger>
                        <AccordionContent>
                            Curiosity is a craving to know, to click, to uncover something hidden. Attackers often use
                            intriguing subject lines or messages to pique your curiosity, leading you to fall for their gimmick. 
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </LearningSection>


        </LearningContent>
    </div>
</template>

<script setup lang="ts">
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import { ref } from 'vue';
import LearningImageBanner from '../../UI/Learning/Image/LearningImageBanner.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import content2_assets from '/public/Learning/Content/introToSocialEngineering/WhatIsSocialEngineering/loveletter.png?url';
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
const principles = ref([
    "Authority: People are more likely to comply.",
    "Scarcity: The fear of missing out ons.",
    "Urgency: Creating a sense of urgenc.",
    "Likability/Rapport: Attackers often.",
    "Social Proof: People tend to do what others are doing..",
    "Reciprocation: If someone gives you something for free."
]);

</script>