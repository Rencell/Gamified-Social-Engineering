<template>
  <div class="bg-[#afe57f] w-fit relative " @click="whack">
    <img :src="whackImage" class="relative z-10 " alt="Whack-a-Mole Base" />
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background w-40 h-20 "
      style="clip-path: ellipse(50% 28% at 50% 50%);"
    ></div>
    <!-- Mole -->
    <div
      class="h-40 w-20 bg-[#f6c298] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 animate-pop "
      :class="!show ? 'animate-unpop' : ''"
    >
      <img :src="faceImage" alt="Mole Face" class="cursor-pointer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import whackImage from '/MiniGames/whack.png';
import faceImage from '/MiniGames/face.webp';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['whack']);

// Emit the whack event when the mole is clicked
const whack = () => {
  if (props.show) {
    emit('whack');
  }
};
</script>


<style scoped>
@keyframes pop {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-50%);
    }

    /* up */
    100% {
        transform: translateY(-50%);
    }

    /* stay up */
}

.animate-pop {
    animation: pop 0.4s ease-in-out forwards;
}

@keyframes unpop {
    0% {
        transform: translateY(-50%);
    }

    50% {
        transform: translateY(0%);
    }

    /* up */
    100% {
        transform: translateY(0%);
    }

    /* stay up */
}

.animate-unpop {
    animation: unpop 0.4s ease-in-out forwards;
}
</style>