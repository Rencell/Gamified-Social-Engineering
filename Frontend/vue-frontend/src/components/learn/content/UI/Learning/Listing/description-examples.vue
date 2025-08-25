<template>

    <div class="flex gap-4 mb-6 items-center">
        <div>
            <p
                class="bg-accent text-primary flex h-8 w-8 items-center justify-center rounded-full p-2 text-lg font-medium">
                {{ props.index }}
            </p>
        </div>
        <div class="font-secondary text-sm">
            {{ props.example }}
        </div>
    </div>
    <div class="w-full bg-white/90 rounded-lg flex justify-center mb-6">
        <div :class="[imageActive ? 'w-2xl' : 'w-96']" class=" bg-red-200 transition-all">
            <img @click.stop="imageActive = !imageActive"  class="w-full cursor-zoom-in"
                :src="props.image" alt="" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const imageActive = ref(false)

const props = defineProps<{
    index: number,
    example: string,
    image: string
}>();
</script>

<style scoped>
img {
    transition: transform .6s;

}

img.active {
    transform: scale(1.5);
}



</style>