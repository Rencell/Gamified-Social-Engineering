<template>
    <LearningContent>
        <LearningSection>

            <LearningBody>
                <Video class="mx-auto" :video-src="video1" />
            </LearningBody>


            <LearningHeader>
                Google Authenticator
            </LearningHeader>


            <LearningBody>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta ullam maiores facere.
                Quod cum corrupti aliquam earum libero odio placeat iusto asperiores iste praesentium nobis dolor
                sed est consectetur, obcaecati, vel laudantium ducimus porro alias, ut ea suscipit repellat. Dicta
                vero officia commodi illum tempore ad quos vel a at.
            </LearningBody>


        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';

import video1 from '/Learning/Content/phishing/Protect/Content2/Authenticator.mp4'
import Video from '../../UI/Learning/Video.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';



</script>

<!-- export const toolsDefenseData = [

    {
        type: 'image',
        img: 'Images/Phishing/defense-woman.svg',
        header: 'Tools to use to boost Your Security',
        subheader: 'Learning to avoid such phishing tactics is not enough to protect yourself, here are popular tools and system as an option to avoid phishing scams.'
    },
    {
        type: 'video',
        video: 'Images/Phishing/Note/VirusTotals.mp4',
        header: 'VirusTotal',
        subheader: 'Learning to avoid such phishing tactics is not enough to protect yourself, here are popular tools and system as an option to avoid phishing scams.'
    },
    {
        type: 'video',
        video: 'Images/Phishing/Note/Authenticator.mp4',
        header: 'Google Authenticator',
        subheader: 'Learning to avoid such phishing tactics is not enough to protect yourself, here are popular tools and system as an option to avoid phishing scams.'
    },
    {
        type: 'video',
        video: 'Images/Phishing/Note/Safebrowsing.mp4',
        header: 'Google Safe Browsing',
        subheader: 'Learning to avoid such phishing tactics is not enough to protect yourself, here are popular tools and system as an option to avoid phishing scams.'
    },
] -->