<template>
    <div class="snap-start min-h-screen flex flex-col items-center justify-center">
        <LearningImage :image="anoynymous" />

        <LearningSection>
            <LearningHeader>
                Impersonation
            </LearningHeader>
            <LearningBody>
                Impersonation is where an attacker pretends to be someone else to
                gain access to information or systems. This attack often relies on trust or authority to
                deceive the target.
            </LearningBody>

            <LearningList>
                <LearningListItem>
                    An example of impersonation when criminals use a fake email of a high-level executive or important
                    business entity.
                </LearningListItem>
                <LearningListItem>
                    Fake identity can be obtained through exposed data from social media, such as fake IDs, emails, to
                    deceive the target.
                </LearningListItem>
                <LearningListItem>
                    With the trend of Artificial Intelligence, attackers can use AI-generated content or deepfake
                    technology to impersonate individuals more convincingly.
                </LearningListItem>
            </LearningList>
        </LearningSection>

    </div>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import anoynymous from '/Learning/Content/introToSocialEngineering/CommonAttacks/anoynymous.svg'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'
</script>