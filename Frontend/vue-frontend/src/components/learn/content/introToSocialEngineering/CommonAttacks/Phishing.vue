<template>
    <div class="snap-start min-h-screen flex flex-col items-center justify-center">
        <LearningImage :image="phishingIcon" />
        <LearningSection>
            <LearningHeader>
                Phishing
            </LearningHeader>
            <LearningBody>
                Phishing is a type of social engineering attack where an attacker attempts to trick individuals into
                providing sensitive information, such as usernames, passwords, or credit card details, by masquerading
                as a trustworthy entity in electronic communications.
            </LearningBody>

            <LearningBody>
                <LearningSpan>
                    There are several common types of phishing attacks:
                </LearningSpan>
            </LearningBody>

            <LearningList>
                <LearningListItem :image="emailListIcon">
                    <LearningSpan2 >Email Phishing:</LearningSpan2> The most common form, where attackers send <LearningSpan>fraudulent emails</LearningSpan> that appear to be from legitimate sources.
                </LearningListItem>
                <LearningListItem :image="TelephoneListIcon">
                    <LearningSpan2 >Vishing:</LearningSpan2> Where attackers use <LearningSpan>phone calls</LearningSpan> to trick victims into revealing personal information.
                </LearningListItem>
                <LearningListItem :image="MobilePhoneListIcon">
                    <LearningSpan2 >Smishing:</LearningSpan2> Phishing attempts via <LearningSpan>SMS messages</LearningSpan>, often containing malicious links.
                </LearningListItem>
                <LearningListItem :image="MobilePhoneListIcon">
                    <LearningSpan2 >Whailing:</LearningSpan2> A more targeted form of phishing that focuses on high-profile individuals or organizations, often using personalized information to increase credibility.
                </LearningListItem>
            </LearningList>
        </LearningSection>
    </div>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/LearningImage.vue'
import phishingIcon from '/public/Learning/Content/introToSocialEngineering/CommonAttacks/phishing@2x.webp'
import LearningSection from '../../UI/Learning/LearningSection.vue'
import LearningBody from '../../UI/Learning/LearningBody.vue'
import LearningHeader from '../../UI/Learning/LearningHeader.vue'
import LearningSpan from '../../UI/Learning/LearningSpan.vue'
import LearningList from '../../UI/Learning/LearningList.vue'
import LearningListItem from '../../UI/Learning/LearningListItem.vue'
import LearningSpan2 from '../../UI/Learning/LearningSpan2.vue'


import emailListIcon from '/public/Learning/Content/introToSocialEngineering/CommonAttacks/listIcons/email-phishing-icon.svg'
import TelephoneListIcon from '/public/Learning/Content/introToSocialEngineering/CommonAttacks/listIcons/telephone-icon.svg'
import MobilePhoneListIcon from '/public/Learning/Content/introToSocialEngineering/CommonAttacks/listIcons/mobile-phone-icon.svg'

</script>