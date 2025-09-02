<template>
    <LearningContent>
        <LearningSection>

            <LearningHeader>
                <LearningSpan>Things to ask yourself</LearningSpan>

            </LearningHeader>

            <LearningBody>
                Scammers are very mindful when to use their tactics, Always read your email thoroughly and ask yourself
                these questions:
            </LearningBody>

            <div class="relative">
                <FlippingCard :data="data" />
            </div>

            <LearningQuote class="mt-50">
                Don't click on the email's links or attachments. Better yet—don't even open the email if it feels
                "phishy" to you.
            </LearningQuote>
        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';
import FlippingCard from '../../UI/Interactive/FlippingCard.vue';
import type { FlippingCardData } from '../../UI/Interactive/types';
import LearningQuote from '../../UI/Learning/Highlight/LearningQuote.vue';

const data: FlippingCardData[] = [
    {
        front: 'Is the email unsolicited?',
        back: 'Avoid clicking on links or downloading attachments from unsolicited emails, especially if they are from unknown senders, or seem suspicious.'
    },
    {
        front: 'Is it offering you something for free?',
        back: "If something seems too good, or too bad to be true, it's probably not true. Be suspicious."
    },
    {
        front: 'Does it use fear tactics?',
        back: 'Phishing emails often create a sense of urgency or threats to prompt quick action. Example ("Your account will be suspended if you do not respond within 24 hours").'
    },
    {
        front: 'Is the sender\'s email address legitimate?',
        back: 'Remember that email addresses can be spoofed, so even if the email appears to come from a trusted source, it may not be legitimate.'
    }
    ,
    {
        front: 'Does it have awkward grammatical phrasing and or spelling errors?',
        back: 'Phishing emails often contain spelling and grammar mistakes. Legitimate communications from reputable organizations are usually well-written and professional.'
    }
    ,
    {
        front: 'Where or who is it coming from?',
        back: 'If you are unsure about an email, contact the organization directly using official contact information from their website or statements.'
    }
];




</script>