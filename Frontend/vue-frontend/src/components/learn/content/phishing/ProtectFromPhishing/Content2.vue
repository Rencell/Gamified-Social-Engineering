<template>
    <LearningContent>
        <LearningSection>
            <LearningHeader>
                Tools to Protect Yourself from Phishing
            </LearningHeader>

            <LearningBody>
                Learning to avoid such phishing tactics is not enough to protect yourself, here are popular tools and
                system as an option to avoid phishing scams.
            </LearningBody>
            
            <LearningBody>
                <Video class="mx-auto" :video-src="video1" />
            </LearningBody>


            <LearningHeader>
                Virus Total
            </LearningHeader>

            
            <LearningBody>
               <LearningSpan>Copy the subject link below. </LearningSpan>
            </LearningBody>
            <LearningBody>
                <GuideBox 
                    language="bash" 
                    label="Don't try to enter the url!" :code="`http://ncquickpassid.top/us`" />
            </LearningBody>

            <LearningBody>
               <LearningSpan> Go to VirusTotal website and paste the link in the search bar.</LearningSpan>
            </LearningBody>
            
            <LearningBody>
                <GuideBox 
                    language="bash" 
                    label="Copy the link" :code="`https://www.virustotal.com/`" />
            </LearningBody>

        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';

import video1 from '/Learning/Content/phishing/Protect/Content2/VirusTotals.mp4'
import { CirclePause, CirclePlay } from 'lucide-vue-next';
import Video from '../../UI/Learning/Video.vue'
import GuideBox from '../../UI/Learning/Highlight/GuideBox/guideBox.vue';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';
import LearningSpanWrong from '../../UI/Learning/Highlight/LearningSpanWrong.vue';



</script>