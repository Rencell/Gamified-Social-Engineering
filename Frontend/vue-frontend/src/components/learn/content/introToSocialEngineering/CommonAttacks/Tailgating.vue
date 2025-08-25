<template>
    <div class="snap-start flex flex-col items-center justify-center"
        :class="showExample ? 'min-h-fit' : 'min-h-screen'">

        <LearningSection>
            <LearningImage2 :image="tailgating" />
            <LearningHeader>
                Tailgating
            </LearningHeader>
            <LearningBody>
                Tailgating which an unauthorized person gains access to a secure area by closely following someone with
                legitimate
                credentials, often without the authorized individual noticing.
            </LearningBody>

            <LearningBody>
                Like the rest of the attacks, this is normally done to gather private or
                sensitive data, steal
                devices or goods, cause some physical damage, harm employees, or execute some physical cybersecurity
                attacks (for
                example, connecting a physical keystroke device).
            </LearningBody>


            <LearningBody>
                <LearningSpan>
                    Here are some common tactics used by tailgaters:
                </LearningSpan>
            </LearningBody>

            <LearningList>
                <LearningListItem>
                    Rushing to enter before the door gets closed
                </LearningListItem>

                <LearningListItem>
                    Using social engineering techniques to get help from another person to gain access
                </LearningListItem>

                <LearningListItem>
                    Placing an object to prevent the door from closing
                </LearningListItem>
                <LearningListItem>
                    Using cloned or stolen credentials
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
import tailgating from '/Learning/Content/introToSocialEngineering/CommonAttacks/tailgating/tailgating.webp'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'

import tailgating_Explain from '/Learning/Content/introToSocialEngineering/CommonAttacks/tailgating-attacks-explained.avif'
import Citation from '../../UI/Learning/Highlight/Citation.vue'
import Button from '@/components/ui/button/Button.vue'
import { ref } from 'vue'
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue'

const showExample = ref(false)

</script>