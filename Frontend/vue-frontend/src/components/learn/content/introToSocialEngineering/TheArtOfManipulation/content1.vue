<template>
    <LearningContent>
        <LearningSection>
            <LearningHeader>
                The Human Hack!
            </LearningHeader>
            <LearningImage2 :image="content1_assets" />
            <LearningBody>
                We can define social engineering as a non-technical attack vector that aims to exploit psychological
                principles to manipulate users to obtain access to physical places, data, and systems.
            </LearningBody>

            <LearningBody>
                <LearningSpan>We can break it down into 3 categories:</LearningSpan>
            </LearningBody>
            <LearningList>
                <LearningListItem>
                    <LearningSpan>
                        Trust:
                    </LearningSpan> It is a fundamental aspect of human relationships, and attackers exploit this by
                    creating a false sense of trust. They may impersonate someone you know or create a fake
                    identity to gain your confidence.
                    money.
                </LearningListItem>
                <LearningListItem>
                    <LearningSpan>
                        Fear and Urgency:
                    </LearningSpan>
                    It push you into making quick decisions without thinking. For example, "You bank account will be
                    locked in 5 minutes, click the link to recover”
                </LearningListItem>
                <LearningListItem>
                    <LearningSpan>
                        Curiosity:
                    </LearningSpan>
                    Curiosity is a craving to know, to click, to uncover something hidden. For example, Your Co-worker
                    sent you a message saying if this is you, followed with: click this link to see
                    the video.
                </LearningListItem>
            </LearningList>
        </LearningSection>

    </LearningContent>
</template>

<script setup lang="ts">
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningImage from '../../UI/Learning/Image/LearningImage.vue';
import content1_assets from '/Learning/Content/introToSocialEngineering/PsychologySocialEngineering/content1.webp';
import Human from '/Human.webp?url';

import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue';



</script>