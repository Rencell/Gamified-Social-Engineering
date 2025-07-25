<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { Card, CardContent } from '@/components/ui/card';
import LearningSection from '../Learning/Core/LearningSection.vue';
import LearningHeader from '../Learning/Core/LearningHeader.vue';
import LearningBody from '../Learning/Core/LearningBody.vue';

</script>

<template>

    
    
    <Card class="mt-5">
        <CardContent>
            <LearningSection>
                <LearningHeader>
                    
                    <p class="text-sm text-gray-300">Sort them according to their geographical size, from largest to
                        smallest: MAN, WAN, LAN, PAN.</p>
                </LearningHeader>
                <LearningBody>
                    
                    <input type="text" placeholder="Answer Format: *****>**>*****>********"
                        class="mb-4 text-sm w-full px-4 py-2 rounded bg-[#2A2A3B] text-white focus:outline-none focus:ring-2 focus:ring-accent" />
                    <Button >Submit</Button>
                </LearningBody>
            </LearningSection>
        </CardContent>
    </Card>
</template>