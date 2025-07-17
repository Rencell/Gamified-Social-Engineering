<template>
    <div class="snap-start min-h-screen flex flex-col items-center justify-center">
        <LearningImage :image="baitingImage" />

        <LearningSection>
            <LearningHeader>
                Baiting
            </LearningHeader>
            <LearningBody>
                Baiting relies <LearningSpan>heavily on urgency and scarcity</LearningSpan> where an attacker lures
                victims into a trap by offering something
                enticing, such as free software or a USB drive, which contains malware or other malicious content.
            </LearningBody>

            <LearningList>
                <LearningListItem>
                    <LearningSpan2>
                        Software scam
                    </LearningSpan2>
                    May involve offering free software or services that are actually malicious, tricking users into
                    downloading malware.
                </LearningListItem>
                <LearningListItem>
                    <LearningSpan2>
                        You won a $1000 gift card!
                    </LearningSpan2>
                    This an example of headline baiting, where the attacker uses a tempting offer to lure victims into
                    clicking on a link or downloading a file that contains malware.
                </LearningListItem>
                <LearningListItem>
                    <LearningSpan2>
                        Physical baiting
                    </LearningSpan2>
                    Baiting can also occur in the physical world, through a <LearningSpan>USB device or QR code</LearningSpan> left in a public
                    place, this human curiosity leading them to a malicious website or directly installing malware on
                    their machine
                </LearningListItem>

            </LearningList>
        </LearningSection>
    </div>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'

import baitingImage from '/public/Learning/Content/introToSocialEngineering/CommonAttacks/Baiting.png'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'
import LearningSpan2 from '../../UI/Learning/Highlight/LearningSpan2.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
</script>