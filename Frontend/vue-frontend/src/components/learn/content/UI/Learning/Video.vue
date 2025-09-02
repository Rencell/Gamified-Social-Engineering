<template>
    <div class="relative m-4 w-xl shadow-lg cursor-pointer" @click="togglePlay()">
        <video ref="videoRef" :src="videoSrc"
            class="w-full h-full object-cover rounded-xl transition-opacity duration-300" playsInline muted />

        <div class="absolute top-0 transition-all flex h-full w-full items-center justify-center rounded-xl"
            :class="[isPlaying ? 'bg-primary/0' : 'bg-primary/40']">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-black/50"
                :class="[isPlaying ? 'opacity-30' : 'opacity-100']">
                <CirclePause v-if="isPlaying" class="size-8" />
                <CirclePlay v-else class="size-8" />


            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { CirclePause, CirclePlay } from 'lucide-vue-next';

const props = defineProps<{
    videoSrc: string;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);


const togglePlay = () => {
    isPlaying.value = !isPlaying.value;
};

watch(isPlaying, async (newVal) => {
    if (videoRef.value) {
        if (newVal) {
            try {
                await videoRef.value.play();
            } catch (error) {
                console.error("Error playing video:", error);
            }
        } else {
            videoRef.value.pause();
            videoRef.value.currentTime = 0;
        }
    }
});

// Set isPlaying to false when video ends
onMounted(() => {
    if (videoRef.value) {
        videoRef.value.addEventListener('ended', () => {
            isPlaying.value = false;
        });
    }
});

onMounted(() => {
    if (videoRef.value) {
        videoRef.value.play();
        videoRef.value.currentTime = 0;
        togglePlay();
    }
});

</script>