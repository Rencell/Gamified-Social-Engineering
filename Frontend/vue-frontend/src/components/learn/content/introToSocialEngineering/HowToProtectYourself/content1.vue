<template>
    <div class="snap-center min-h-screen flex flex-col items-center justify-center">
        <Transition name="fade">
            <LearningImage v-if="visibleItemCount < 4" :image="man_with_shield" />
        </Transition>

        <LearningSection>

            <LearningHeader>
                <LearningSpan>Defend</LearningSpan> : Learn to be safe
            </LearningHeader>

            <LearningBody>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, hic.</LearningBody>

            <LearningList>
                <TransitionGroup name="fade">
                    <template v-for="(item, index) in visibleItems" :key="index">
                        <LearningListItemNumbered :image="item.image" :number="index + 1"
                            :class="index + 1 == visibleItemCount ? 'opacity-100' : 'opacity-30'">
                            <LearningSpan>{{ item.title }}</LearningSpan>: {{ item.description }}
                        </LearningListItemNumbered>
                    </template>
                </TransitionGroup>
            </LearningList>

            <div class="flex mx-auto">
                <Button v-if="visibleItemCount < items.length" @click="showNext" variant="link">See more</Button>
            </div>
        </LearningSection>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningSpan2 from '../../UI/Learning/Highlight/LearningSpan2.vue'
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'

import content1_asset from '/public/Learning/Content/introToSocialEngineering/PsychologySocialEngineering/content1-asset.svg?url'
import LearningListItemNumbered from '../../UI/Learning/Listing/LearningListItemNumbered.vue'

import man_with_shield from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/man_with_shield.png'
import LearningListImage from '../../UI/Learning/Listing/LearningListImage.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

import eye_icon from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon/eye-icon.svg'
import gift_icon from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon/gift-icon.svg'
import chat_icon from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon/chat-icon.svg'
import money_icon from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon/money-icon.svg'
import book_icon from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon/book-icon.svg'
import fingerprint_icon from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon/fingerprint-vibrant.svg'

const items = [
    {
        title: 'Trust no one',
        image: eye_icon,
        description: 'Always verify before you trust, even your family or colleagues can be a weakest spot of security.'
    },
    {
        title: 'Beware of free',
        image: gift_icon,
        description: 'Offers that seem too good to be true, such as free gifts or prizes, are often used to trick you into giving away personal information.'
    },
    {
        title: 'Don\'t overshare on Facebook',
        image: chat_icon,
        description: 'Or in any other social media because attackers can use your information for security questions that will trouble your accounts.'
    },
    {
        title: 'Involves Money',
        image: money_icon,
        description: 'Don\'t be easily fooled with quick-rich promises, this is just a classic psychological tactics that test your greed and urgency.'
    },
    {
        title: 'Understand Social Engineering Tactics',
        image: book_icon,
        description: 'By learning how social engineers operate, you can better recognize and avoid their schemes. Stay informed through reputable online resources or attend security awareness seminars.'
    }
]

const visibleItemCount = ref(1)

const visibleItems = computed(() => items.slice(0, visibleItemCount.value))

const showNext = () => {
    if (visibleItemCount.value < items.length) {
        visibleItemCount.value++
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>