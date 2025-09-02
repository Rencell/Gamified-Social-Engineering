<template>
    <LearningContent>
        <LearningSection>
            
            <LearningHeader>Types of Phishing Attacks</LearningHeader>
            
            <LearningBody></LearningBody>
            <LearningBody>
                <FlippingCard :data="data" />
            </LearningBody>
        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import FlippingCard from '../../UI/Interactive/FlippingCard.vue';
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import type { FlippingCardData } from '../../UI/Interactive/types';

const data: FlippingCardData[] = [
    {
        front: 'Email phishing',
        back: 'Email phishing is one of the most common phishing attack methods and is where attackers send emails to users to steal their personal information.'
    },
    {
        front: 'Whaling',
        back: 'Whaling is a type of email phishing attack that’s also known as CEO fraud. It’s when the targets of the attackers are high-level executives, such as the CEOs or CFOs of an organization.'
    },
    {
        front: 'Spear phishing',
        back: 'This attack is very different from normal phishing attacks because, while phishing attacks target a massive number of users in a single email, a spear phishing attack targets a single individual.'
    },
    {
        front: 'Smishing',
        back: 'SMS phishing, also known as smishing, is a type of social engineering attack where attackers try to steal the personal information of individuals by sending a personal SMS message asking them to perform an action such as entering a link, calling a number, or responding with some sensitive data.'
    }
    ,
    {
        front: 'Vishing',
        back: 'Voice phishing, also known as vishing, is a type of phishing attack where attackers use voice communication to trick people into revealing sensitive data'
    }
    ,
    {
        front: 'Calendar phishing',
        back: 'also known as calendar hijacking, is a type of phishing attack in which the attacker sends a calendar invitation that seems to be from a trusted source but it contains a malicious link or requests some sensitive information.'
    }
];

</script>