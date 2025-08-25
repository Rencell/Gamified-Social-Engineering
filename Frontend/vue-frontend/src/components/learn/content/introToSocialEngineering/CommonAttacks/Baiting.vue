<template>
    <div class="snap-start min-h-screen flex flex-col items-center justify-center">

        <LearningSection>
            <LearningHeader>
                Baiting
            </LearningHeader>
            <LearningImage2 :image="baiting" />
            <LearningBody>
                Baiting relies <LearningSpan>heavily on curiosity and scarcity</LearningSpan> where an attacker lures
                victims into a trap by offering something
                enticing, such as free software or a USB drive, which contains malware or other malicious content.
            </LearningBody>

            <LearningBody>
                The attacker will gather some sensitive information from the victim, get unauthorized
                access to
                systems, or even infect the entire infrastructure of a company.
            </LearningBody>

            <LearningBody>
                <LearningSpan>There are two types of baiting attacks: </LearningSpan>
            </LearningBody>


            <DescriptionList :data="descriptionData" />
        </LearningSection>
    </div>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'

import baitingImage from '/Learning/Content/introToSocialEngineering/CommonAttacks/Baiting.png'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'
import LearningSpan2 from '../../UI/Learning/Highlight/LearningSpan2.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue'

import baiting from '/Learning/Content/introToSocialEngineering/CommonAttacks/phishing_1.webp'
import baiting_1 from '/Learning/Content/introToSocialEngineering/CommonAttacks/baiting/baiting_1.webp'
import type { DescriptionData } from '../../UI/Learning/Listing/type';
import DescriptionList from '../../UI/Learning/Listing/description-list.vue'

// List icons

import Usb from '/Learning/Content/introToSocialEngineering/CommonAttacks/baitinglistIcons/Usb.webp'
const descriptionData: DescriptionData[] = [
    {
        heading: 'Physical Baiting',
        subheading: 'Inserting a USB drive into a computer',
        image: Usb,
        description: 'In this type of attack, the attacker uses a physical object to lure the victim into connecting the object to the computer to infect the system and exfiltrate data or cause damage to the system.',
        examples: [],
        signs: [
            'Offers of free or cheap tech items',
            'Physical media left in public places',
            'Came from a untrusted source',
        ]
    },

    {
        heading: 'Cyber baiting',
        subheading: 'New game release for free now!',
        image: baitingImage,
        description: 'In cyber baiting, the attacker uses digital resources to attract the victim.',
        examples: [
            {
                example: 'Free software, movies, games, or e-books offered online for free are common types of cyber baiting, and most of the time, they are used to infect the victim’s computer with malware.',
                image: baiting_1
            }
        ],
        signs: [
            'A web page (or email) offering incredible discounts',
            'A free download for expensive software',
            'A free download for software to spy on social media accounts',
            'A free download for software to mine crypto',
            'A link to meet attractive people in your area',
            'A link to claim some type of award',
            'Links to scandals related to famous people',
            'Recipes to easily cure some common illnesses',
            'A guide with tricks to win the lottery',
            'A page to access paid resources for free (books, movies, and so on)'
        ]
    },

];


</script>