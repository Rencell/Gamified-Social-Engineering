<template>
    <LearningContent>

        <TwoImage Question="Which image shows a legitimate message?" :image1="asset1" :image2="asset2" answer="image1"
            correctExplanation="This is the correct answer." :position-left="true">

            <template #lesson>
                <LearningSection>

                    <LearningImage2 :image="asset1" class="h-100"></LearningImage2>
                    <LearningHeader>
                        Sms Spoofing
                    </LearningHeader>
                    <LearningBody>
                        From previous module, we tackled how to identify red flags of Smishing attacks. While the example above, the
                        message source comes from a legitimate source, so how is this a scam?
                    </LearningBody>

                    <LearningBody>
                        According to <Citation word="Gcash" citation-link="https://www.facebook.com/gcashofficial/posts/how-to-spot-the-spoof-kahit-gcash-ang-nag-text-ng-link-wag-i-click-dahil-sms-spo/1177767221054733/"></Citation>
                        , Even if the message appears to come from a legitimate source, it can still be a scam. This is because attackers use illegal cellsite to hijack the SMS.
                    </LearningBody>

                    <LearningBody>
                        <LearningSpan>To protect from this scam</LearningSpan>
                        <LearningList>
                            <LearningListItem>Gcash will not send any link through SMS, so don't click any links from SMS messages.</LearningListItem>
                            <LearningListItem>Contact the company directly using their official contact information.</LearningListItem>
                            <LearningListItem>Report the incident to your mobile carrier.</LearningListItem>

                        </LearningList>
                    </LearningBody>
                </LearningSection>
            </template>
        </TwoImage>
    </LearningContent>
</template>

<script setup lang="ts">
import TwoImage from '../../UI/Interactive/TwoImage.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import Citation from '../../UI/Learning/Highlight/Citation.vue';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue';
import LearningList from '../../UI/Learning/Listing/LearningList.vue';
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue';
import asset1 from '/Learning/Content/phishing/RealWorldExample/Content1/asset1.webp'
import asset2 from '/Learning/Content/phishing/RealWorldExample/Content1/asset2.webp'
</script>