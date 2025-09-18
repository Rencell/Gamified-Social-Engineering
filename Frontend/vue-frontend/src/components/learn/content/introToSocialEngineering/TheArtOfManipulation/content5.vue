<template>

    <LearningContent>
        <LearningSection>
            <LearningImage :image="content1_asset" />

            <LearningHeader>
                <LearningSpan>Tips</LearningSpan> : Ask yourself these questions
            </LearningHeader>

            <LearningBody>
                Most of us forget a few details when we are asked for information. We often do not think about the
                context or legitimacy of the request, which can lead to vulnerabilities.

            </LearningBody>
            <LearningList>
                <LearningListItemNumbered :number="1">
                    <LearningSpan>Does</LearningSpan> it <LearningSpan2>make sense</LearningSpan2> for this person to
                    reach out to me?
                </LearningListItemNumbered>
                <LearningListItemNumbered :number="2">
                    <LearningSpan>Does</LearningSpan> this person behave in a <LearningSpan2>trustworthy</LearningSpan2>
                    manner?
                </LearningListItemNumbered>
                <LearningListItemNumbered :number="3">
                    <LearningSpan>Does</LearningSpan> this person have <LearningSpan2>authority</LearningSpan2>?
                </LearningListItemNumbered>
                <LearningListItemNumbered :number="4">
                    <LearningSpan>Does</LearningSpan> this person have a <LearningSpan2>legitimate</LearningSpan2>
                    reason to ask for this information?
                </LearningListItemNumbered>
            </LearningList>
        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningSpan2 from '../../UI/Learning/Highlight/LearningSpan2.vue'
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'

import content1_asset from '/Learning/Content/introToSocialEngineering/PsychologySocialEngineering/content1-asset.svg?url'
import LearningListItemNumbered from '../../UI/Learning/Listing/LearningListItemNumbered.vue'
import LearningContent from '../../UI/Learning/Core/LearningContent.vue'
</script>