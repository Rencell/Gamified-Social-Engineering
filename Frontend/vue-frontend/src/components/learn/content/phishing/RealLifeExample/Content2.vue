<template>
    <LearningContent>
        <LearningSection>

            <LearningImage2 :image="asset1"></LearningImage2>
            <LearningHeader>
                Yahoo! attack
            </LearningHeader>

            <LearningBody>
                Back in 2014, millions of Yahoo! users were attacked by receiving phishing emails that seemed like they
                were sent by Yahoo!.
                
            </LearningBody>
            <LearningBody>
                In this case, the method that was used by the attackers was the same used in AOL – that is, using a fake
                login page to steal their data.
                
            </LearningBody>

            <LearningBody>
                <LearningSpan>As you can see, the email seems to be real but contains a lot of details to help you not fall into attackers’ traps:</LearningSpan>
            </LearningBody>

            <LearningList>
                <LearningListItem>The email address is different from the official Yahoo! email address.</LearningListItem>
                <LearningListItem>The link does not lead to an official Yahoo! page.</LearningListItem>
                <LearningListItem>The email contains a lot of grammatical errors.</LearningListItem>
                <LearningListItem>The email creates a sense of urgency to make you act quickly without thinking.</LearningListItem>

            </LearningList>
        </LearningSection>
    </LearningContent>
</template>
<script setup lang="ts">
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue';
import LearningList from '../../UI/Learning/Listing/LearningList.vue';
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue';
import asset1 from '/Learning/Content/phishing/RealWorldExample/Content2/asset1.webp'
</script>