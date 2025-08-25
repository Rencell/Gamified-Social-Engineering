<template>
    <div class="snap-start min-h-screen flex flex-col items-center justify-center">
        <LearningImage :image="Social_Media" />

        <LearningSection>
            <LearningHeader>
                Social Media Fraud
            </LearningHeader>
            <LearningBody>
                Many of us have come to depend on platforms like Facebook, Instagram, and Twitter to stay connected,
                follow the news, and even make purchases. However, as their popularity has grown, so has the risk of
                fraud.
            </LearningBody>

            <LearningBody>
                <LearningSpan>
                    the most common that are executed on social media sites
                </LearningSpan>
            </LearningBody>

            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Infected friends</AccordionTrigger>
                    <AccordionContent>
                        Be cautious when a friend asks for help or shares
                        links, as their account may have been stolen or compromised by attackers.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Romance Scam</AccordionTrigger>
                    <AccordionContent>
                        The attacker creates a fake social media account to impersonate an attractive person (either
                        male or
                        female). The goal is to manipulate the person to fall in love and enter a virtual relationship.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>Bot accounts</AccordionTrigger>
                    <AccordionContent>
                        You may come across a post that has a lot of positive
                        feedback; bots may manipulate the post to make it appear more convincing.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger>OSINT</AccordionTrigger>
                    <AccordionContent>
                        OSINT stands for Open Source Intelligence. It just means people
                        can find and use info that’s already out there online. Example your social media posts or public
                        profiles which scammers might use to trick you.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                    <AccordionTrigger>Fake investment</AccordionTrigger>
                    <AccordionContent>
                        This scam consists of investment posts on social media sites that offer very good returns
                        without any skill, education,
                        or experience required.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                    <AccordionTrigger>Fake advertisements</AccordionTrigger>
                    <AccordionContent>
                        Fake advertisements are posts that appear to be from a legitimate company, but are actually
                        created by scammers to trick people into giving them money or personal information.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </LearningSection>

    </div>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import Social_Media from '/Learning/Content/introToSocialEngineering/CommonAttacks/Social_Media.webp'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
import tailgating from '/Learning/Content/introToSocialEngineering/CommonAttacks/tailgating/tailgating.webp'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
</script>