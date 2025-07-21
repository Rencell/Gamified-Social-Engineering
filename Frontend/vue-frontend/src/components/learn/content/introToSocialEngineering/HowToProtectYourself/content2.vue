<template>
    <div class="snap-center min-h-screen flex flex-col items-center justify-center">
        <Transition name="fade">

            <LearningQuote variant="danger" v-if="visibleItemCount < 4">
                If your password is easy to guess, your data is easy to steal.
            </LearningQuote>
        </Transition>
        <!-- <Transition name="fade">
            <LearningImage v-if="visibleItemCount < 4" :image="content2_asset" />
        </Transition> -->
        <LearningSection>

            
            <LearningList>
                <TransitionGroup name="fade">
                    <template v-for="(item, index) in visibleItems" :key="index">
                        <LearningListItemNumbered :image="item.image" :number="index + 1"
                            :class="index + 1 == visibleItemCount ? 'opacity-100' : 'opacity-30'">
                            <LearningSpan>{{ item.title }}</LearningSpan>: {{ item.description }}
                            <LearningSpan2>
                                <a v-if="item.link" :href="item.link" target="_blank"
                                    class="text-blue-500 hover:underline">
                                    {{ item.linkTitle }}
                                </a>
                            </LearningSpan2>
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

import content1_asset from '/public/Learning/Content/introToSocialEngineering/PsychologySocialEngineering/content2-asset.svg?url'
import LearningListItemNumbered from '../../UI/Learning/Listing/LearningListItemNumbered.vue'


import LearningListImage from '../../UI/Learning/Listing/LearningListImage.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

import eye_icon from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon/eye-icon.svg'
import gift_icon from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon/gift-icon.svg'
import chat_icon from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon/chat-icon.svg'
import money_icon from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon/money-icon.svg'
import book_icon from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon/book-icon.svg'
import fingerprint_icon from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon/fingerprint-vibrant.svg'
import LearningQuote from '../../UI/Learning/Highlight/LearningQuote.vue'

const items = [
    {
        title: 'Change your passwords',
        image: eye_icon,
        description: 'Atleast change your passwords every 3 months, and use a password manager to generate and store complex passwords.'
    },
    {
        title: 'Use temporary email addresses',
        image: gift_icon,
        description: 'When signing up for services, use temporary email addresses to avoid spam and protect your primary email from phishing attacks.',
        linkTitle: 'example temporary email service',
        link: 'https://temp-mail.org/'
    },
    {
        title: 'Use Two-Factor Authentication (2FA)',
        image: fingerprint_icon,
        description: 'Even if your password is stolen, 2FA provides an extra security that can prevent unauthorized access to your accounts.'
    },
    {
        title: 'Use trusted DNS or VPN',
        image: fingerprint_icon,
        description: 'Use privacy-focused DNS or a VPN to prevent eavesdropping and bypass malicious redirects.',
        linkTitle: 'example VPN service',
        link: 'https://www.expressvpn.com/'
    },
    {
        title: 'Don\'t connect to public Wi-Fi',
        image: fingerprint_icon,
        description: 'Avoid connecting to public Wi-Fi networks, as they can be easily compromised. If necessary, use a VPN to secure your connection.',
    },
    {
        title: 'Never share code',
        image: fingerprint_icon,
        description: 'If someone asks you to share your code, be cautious. Legitimate services will never ask for your code or password.',
    },
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