<template>
    <LearningContent>
        <LearningSection>
            
            <LearningHeader>
                Steps to Protect Yourself from Phishing Attacks
            </LearningHeader>
            
            <NextCard :data="data" />
            <LearningBody>
                <LearningQuote variant="info">
                    Phishing scams are popular because they work. However, there are steps you can take to protect
                    yourself and avoid becoming a victim of a phishing scam.
                </LearningQuote>
            </LearningBody>
        </LearningSection>
    </LearningContent>

</template>

<script setup lang="ts">
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import LearningQuote from '../../UI/Learning/Highlight/LearningQuote.vue'
import NextCard from '../../UI/Interactive/NextCard.vue'
import asset1 from '/Learning/Content/phishing/Protect/Content1/list1.webp'
import asset2 from '/Learning/Content/phishing/Protect/Content1/list2.webp'
import asset3 from '/Learning/Content/phishing/Protect/Content1/list3.webp'
import asset4 from '/Learning/Content/phishing/Protect/Content1/list4.webp'
import asset5 from '/Learning/Content/phishing/Protect/Content1/list5.webp'

const data = [
    {
        id: 1,
        head: 'Check the email address of the sender',
        text: 'You can see the real sender by dragging your mouse on top of the email address or double-clicking it',
        image:asset1
    },
    {
        id: 2,
        head: 'Always check the Button Links',
        text: 'Always be cautious when receiving unsolicited emails, messages, or phone calls, especially if they ask for sensitive information or urge immediate action.',
        image:asset2
    },
    {
        id: 3,
        head: 'Check whether the email sounds too good to be true',
        text: 'Always be cautious when receiving unsolicited emails, messages, or phone calls, especially if they ask for sensitive information or urge immediate action.',
        image:asset3
    },
    {
        id: 4,
        head: 'Check whether it is a generic email',
        text: 'In most cases, phishing emails use generic words such as Dear Friend as they are sent to thousands of people (this does not apply to spear phishing attacks).',
        image:asset4
    },
    {
        id: 5,
        head: 'Check the language used',
        text: 'Grammar and spelling errors are common in phishing emails. Legitimate messages from companies are usually well-written.',
        image:asset5
    },
];
</script>