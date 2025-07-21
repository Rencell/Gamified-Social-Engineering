<template>
    <div class="snap-start flex flex-col items-center justify-center" :class="showExample ? 'min-h-fit' : 'min-h-screen'">
        <LearningImage :image="tailgating" />

        <LearningSection>
            <LearningHeader>
                Tailgating
            </LearningHeader>
            <LearningBody>
                Tailgating which an unauthorized person gains access to a secure area by closely following someone with
                legitimate
                credentials, often without the authorized individual noticing.
            </LearningBody>

            <LearningList>
                <LearningListItem>
                    <LearningSpan>
                        Show Kindness
                    </LearningSpan>: They will act friendly towards you to gain your trust and make you less likely to
                    question their presence.
                </LearningListItem>

                <LearningListItem>
                    <LearningSpan>
                        Fake Employee
                    </LearningSpan>: They may pretend to be an employee (such as having ID, or tells to be IT personel)
                    or contractor to blend in and gain access
                    without raising suspicion.
                </LearningListItem>

                <LearningListItem>
                    <LearningSpan>
                        Act in a Hurry
                    </LearningSpan>: They may pretend to be in a rush, hoping you’ll hold the door open out of courtesy
                    or urgency.
                </LearningListItem>
            </LearningList>

            <div class="flex mb-3">
                <Button @click="showExample = !showExample" class="mx-auto">Click for visual scenario</Button>
                
            </div>
            <div v-if="showExample" class="animate-in fade-in zoom-in duration-500">
                <img class="rounded-lg transition-all duration-300" :src="tailgating_Explain" alt="">
                <div class="mt-2">
                    <LearningSpan>Image Reference: </LearningSpan>
                    <Citation class=" text-gray-400 italic"
                        word="https://us.norton.com/blog/emerging-threats/tailgating-attack"
                        citation-link="https://us.norton.com/blog/emerging-threats/tailgating-attack" />
                </div>
            </div>
        </LearningSection>



    </div>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import tailgating from '/public/Learning/Content/introToSocialEngineering/CommonAttacks/tailgating.png'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'

import tailgating_Explain from '/public/Learning/Content/introToSocialEngineering/CommonAttacks/tailgating-attacks-explained.avif'
import Citation from '../../UI/Learning/Highlight/Citation.vue'
import Button from '@/components/ui/button/Button.vue'
import { ref } from 'vue'

const showExample = ref(false)

</script>