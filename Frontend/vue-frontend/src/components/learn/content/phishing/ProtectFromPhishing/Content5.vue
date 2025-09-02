<template>
    <LearningContent>
        <LearningSection>

            <LearningBody>
                <Video class="mx-auto" :video-src="video1" />
            </LearningBody>


            <LearningHeader>
                Password Manager
            </LearningHeader>


            <LearningBody>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta ullam maiores facere.
                Quod cum corrupti aliquam earum libero odio placeat iusto asperiores iste praesentium nobis dolor
                sed est consectetur, obcaecati, vel laudantium ducimus porro alias, ut ea suscipit repellat. Dicta
                vero officia commodi illum tempore ad quos vel a at.
            </LearningBody>

            <LearningBody>
                <LearningSpan>Watch how to setup</LearningSpan>
                <LearningList>
                    <LearningListItem>
                        
                        <Citation word="Desktop" citation-link="https://www.youtube.com/watch?v=sf8qa2HcKSs&ab_channel=Bitwarden" ></Citation>
                    </LearningListItem>
                    <LearningListItem>
                        <Citation word="Android" citation-link="https://www.youtube.com/watch?v=sf8qa2HcKSs&ab_channel=Bitwarden" ></Citation>
                    </LearningListItem>
                    
                </LearningList>
            </LearningBody>

        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';

import video1 from '/Learning/Content/phishing/Protect/Content2/PasswordManager.mp4'
import Video from '../../UI/Learning/Video.vue'
import Citation from '../../UI/Learning/Highlight/Citation.vue';
import LearningList from '../../UI/Learning/Listing/LearningList.vue';
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';



</script>

