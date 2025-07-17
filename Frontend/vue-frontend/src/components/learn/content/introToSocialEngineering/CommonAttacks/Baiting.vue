<template>
    <div class="snap-start min-h-screen flex flex-col items-center justify-center">
        <LearningImage :image="baitingImage" />

        <LearningSection>
            <LearningHeader>
                Baiting
            </LearningHeader>
            <LearningBody>
                Baiting is a social engineering attack where an attacker lures victims into a trap by offering something
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

            </LearningList>
        </LearningSection>
    </div>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/LearningImage.vue'
import LearningSection from '../../UI/Learning/LearningSection.vue'
import LearningHeader from '../../UI/Learning/LearningHeader.vue'
import LearningBody from '../../UI/Learning/LearningBody.vue'

import baitingImage from '/public/Learning/Content/introToSocialEngineering/CommonAttacks/Baiting.png'
import LearningList from '../../UI/Learning/LearningList.vue'
import LearningListItem from '../../UI/Learning/LearningListItem.vue'
import LearningSpan2 from '../../UI/Learning/LearningSpan2.vue'
</script>