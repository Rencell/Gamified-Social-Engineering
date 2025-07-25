<template>
    <div class="snap-start min-h-screen flex flex-col items-center justify-center">
        <LearningSection>
            <LearningHeader>You are being hacked!</LearningHeader>
            <LearningBody>
                <LearningSpan>Social engineers</LearningSpan> are extremely good at <LearningSpan>manipulating people
                </LearningSpan>.
                They extract information from <LearningSpan>social media</LearningSpan>, <LearningSpan>receipts
                </LearningSpan>,
                and can cause a lot of damage.
            </LearningBody>
            <LearningBody>
                If you are someone who frequently shares <LearningSpan>personal information online</LearningSpan>,
                you might be at risk. <LearningSpan>Social engineers</LearningSpan> can use this information to create
                <LearningSpan>convincing scams</LearningSpan> that <LearningSpan>target you specifically</LearningSpan>.
            </LearningBody>
            
            <LearningList>
                <LearningListItem :image="list1_image">
                    They can trick you into giving away your passwords, personal information, or even money
                </LearningListItem>
                <LearningListItem :image="list2_image">
                    They can do this through phishing emails, fake websites, or even phone calls that seem legitimate
                </LearningListItem>
            </LearningList>


            <LearningQuote>
                Statistically says, 98% of cyber attacks involve some form of social engineering.
                <Citation word="(Indusface, 2025)"
                    citation-link="https://www.indusface.com/learning/what-is-a-social-engineering-attack/" />
            </LearningQuote>
        </LearningSection>

    </div>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import Citation from '../../UI/Learning/Highlight/Citation.vue'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningContent from '../../UI/Learning/Core/LearningContent.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
import LearningQuote from '../../UI/Learning/Highlight/LearningQuote.vue'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'

import list1_image from '/Learning/Content/introToSocialEngineering/WhatIsSocialEngineering/list1-icon.svg?url'
import list2_image from '/Learning/Content/introToSocialEngineering/WhatIsSocialEngineering/list2-icon.svg?url'

import content2_assets from '/Learning/Content/introToSocialEngineering/WhatIsSocialEngineering/content2-asset.svg?url';
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'


</script>