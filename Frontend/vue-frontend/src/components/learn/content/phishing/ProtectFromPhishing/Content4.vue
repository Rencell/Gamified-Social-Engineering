<template>
    <LearningContent>
        <LearningSection>

            <LearningBody>
                <Video class="mx-auto" :video-src="video1" />
            </LearningBody>


            <LearningHeader>
                Google Safe Browsing
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

import video1 from '/Learning/Content/phishing/Protect/Content2/Safebrowsing.mp4'
import Video from '../../UI/Learning/Video.vue'



</script>

