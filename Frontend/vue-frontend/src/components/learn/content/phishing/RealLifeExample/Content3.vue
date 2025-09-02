<template>
    <LearningContent>
        <LearningSection>

            <LearningHeader>
                Google attack
            </LearningHeader>

            <LearningBody>
                In 2017, there was another major phishing attack but, this time, the targets of the hackers were Google
                Docs users.
                The attack was based on an email that seemed to be sent from a legitimate Google email address, asking
                users to click
                on a link to access their Google Docs

            </LearningBody>
            <LearningBody>
                Users were then redirected to a fake login page from where attackers stole
                user data, including usernames, passwords, and more.

            </LearningBody>

            <LearningImage2 :image="asset1">

            </LearningImage2>

            <LearningBody>
                <LearningSpan>As in in the previous example of Yahoo! users, the email seems to be real but contains a lot of details to prevent you
                    falling into the attackers’ traps:</LearningSpan>
            </LearningBody>

            <LearningList>
                <LearningListItem>If you hover the button, you can see that the link does not lead to an official Google page.
                </LearningListItem>
                <LearningListItem>The link does not lead to an official Google! page.</LearningListItem>
                <LearningListItem>The email contains a lot of grammatical errors.</LearningListItem>

            </LearningList>
        </LearningSection>
    </LearningContent>
</template>
<script setup lang="ts">
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue';
import LearningList from '../../UI/Learning/Listing/LearningList.vue';
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue';
import asset1 from '/Learning/Content/phishing/RealWorldExample/Content2/asset2.webp'
</script>