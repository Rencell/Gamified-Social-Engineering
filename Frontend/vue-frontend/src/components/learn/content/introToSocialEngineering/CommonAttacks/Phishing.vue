<template>
    <LearningContent>
        <!-- <LearningImage :image="phishingIcon" /> -->
        <LearningSection>
            <TwoImage Question="Which do you think shows Phishing?" :image1="baiting" :image2="phishing"
                answer="image2" correct-explanation="Correct this image shows a phishing attempt"
                incorrect-explanation="Nice try, but this attack is a Baiting attack, and the image shows a USB drop attack."
                @imageSelected="handleImageSelection"
                @showDown="emit('showDown', true)"
                >
                <template #lesson>
                    <LearningSection>
                        <LearningHeader>
                            Phishing
                        </LearningHeader>
                        <LearningImage2 :image="phishing" :alt-text="'Conversation Image'" />
                        <LearningBody>
                            <LearningSpan>Phishing attacks</LearningSpan> are one of the most common types of
                            cyberattacks and impact both
                            individuals and corporations alike. The attack is simple, and its name came from the word
                            fishing as these attacks also use bait to make the victim fall
                            into a trap.
                        </LearningBody>

                        <LearningBody>
                            Phishing emails have become the method to deliver
                            more dangerous (and complex) attacks, such as ransomware. <LearningSpan2>The most common template</LearningSpan2> for
                            phishing attack is to tell to the victim that their data had been compromised and asked them
                            to update their personal information using the link in the email.
                        </LearningBody>
                        <LearningBody>
                            <LearningSpan>
                                There are several common types of phishing attacks:
                            </LearningSpan>
                        </LearningBody>

                        <LearningList>
                            <LearningListImage :image-src="emailListIcon" :alt-text="'Email Phishing Icon'">
                                <LearningSpan2>Email Phishing:</LearningSpan2> The most common form, where attackers
                                send <LearningSpan>fraudulent emails</LearningSpan> that appear to be from legitimate
                                sources.
                            </LearningListImage>
                            <LearningListImage :image-src="TelephoneListIcon" :alt-text="'Telephone Icon'">
                                <LearningSpan2>Vishing:</LearningSpan2> Where attackers use <LearningSpan>phone calls
                                </LearningSpan> to trick victims into revealing personal information.
                            </LearningListImage>
                            <LearningListImage :image-src="MobilePhoneListIcon" :alt-text="'Telephone Icon'">
                                <LearningSpan2>Smishing:</LearningSpan2> Phishing attempts via <LearningSpan>SMS
                                    messages</LearningSpan>, often containing malicious links.
                            </LearningListImage>
                            <LearningListImage :image-src="whaleIcon" :alt-text="'Whale Icon'">
                                <LearningSpan2>Whailing:</LearningSpan2> A more targeted form of phishing that focuses
                                on <LearningSpan>high-profile individuals or organizations</LearningSpan>, often using
                                personalized information to increase credibility.
                            </LearningListImage>

                        </LearningList>
                    </LearningSection>
                </template>
            </TwoImage>

        </LearningSection>

    </LearningContent>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import baiting from '/Learning/Content/introToSocialEngineering/CommonAttacks/phishing_1.webp'
import phishing from '/Learning/Content/introToSocialEngineering/CommonAttacks/phishing_2.webp'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningSpan2 from '../../UI/Learning/Highlight/LearningSpan2.vue'

import emailListIcon from '/Learning/Content/introToSocialEngineering/CommonAttacks/listIcons/email-phishing-icon.svg'
import TelephoneListIcon from '/Learning/Content/introToSocialEngineering/CommonAttacks/listIcons/telephone-icon.svg'
import MobilePhoneListIcon from '/Learning/Content/introToSocialEngineering/CommonAttacks/listIcons/mobile-phone-icon.svg'
import whaleIcon from '/Learning/Content/introToSocialEngineering/CommonAttacks/listIcons/whale-icon.svg'
import LearningListImage from '../../UI/Learning/Listing/LearningListImage.vue'
import LearningContent from '../../UI/Learning/Core/LearningContent.vue'
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue'
import TwoImage from '../../UI/Interactive/TwoImage.vue'
import { onMounted } from 'vue'

const emit = defineEmits(['showDown']);
const handleImageSelection = (selectedImage: string) => {
    console.log('Selected Image:', selectedImage);
};

onMounted(() => {
    emit('showDown', false)
});

</script>