<template>
  <div class="py-20 w-full flex-center overflow-auto rounded-xl">
    <div class="w-2xl flex justify-between items-center">
      <!-- Stepback -->
      <div>
        <div
          :class="['cursor-pointer w-13 h-13 rounded-full bg-black flex-center transition-opacity duration-500', currentIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100 cursor-pointer']"
          @click="previousTip"
        >
          <StepBack />
        </div>
      </div>

      <!-- Card Content -->
      <div
        v-if="currentIndex === 0"
        class="motion-preset-slide-right motion-delay-500 gap-4 w-lg shadow-xl rounded-lg bg-primary p-10 h-fit flex-center flex-col text-black"
      >
        <strong class="text-center text-2xl">Five Steps to Protect from Phishing</strong>
        <img src="https://picsum.photos/id/1/600/200" alt="Step Image" />
        <p class="text-center text-sm/6">
          By taking the following steps promptly and systematically, you can significantly reduce the risk of falling
          victim to phishing attacks.
        </p>
        <Button @click="nextTip">Next</Button>
      </div>

      <div
        v-else
        :key="currentTip.id"
        class="motion-preset-slide-right motion-delay-500 gap-4 w-lg shadow-md border-1 border-gray-200 rounded-lg bg-white p-10 h-fit flex-center flex-col text-black"
      >
        <div class="py-2 px-7 font-bold text-lg bg-accent rounded-lg absolute text-white -top-5">
          Step {{ currentTip.id }}
        </div>
        <strong class="text-center text-2xl">{{ currentTip.head }}</strong>
        <div class="relative mb-5 w-full bg-background p-3 rounded-xl">

          <img :src="currentTip.image" class=" rounded-lg" alt="Step Image" />
        </div>
        <p class="text-center text-sm/6 font-semibold">{{ currentTip.text }}</p>

        <div class="flex gap-3 text-gray-500">
          <div
            v-for="index in data.length"
            :key="index"
            :class="[ 
              'text-black border-2 rounded-full w-7 h-7 flex-center',
              currentTip.id === index ? 'border-accent' : 'border-ternary',
            ]"
          >
            <p v-if="index !== data.length">{{ index }}</p>
            <p v-else>✔</p>
          </div>
        </div>
      </div>

      <!-- Stepforward -->
      <div
        :class="['w-13 h-13 rounded-full bg-black flex-center transition-opacity duration-500',  currentIndex === data.length ? 'opacity-0 cursor-default' : 'opacity-100 cursor-pointer' ]"
        @click="nextTip"
      >
        <StepForward />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { StepBack, StepForward } from 'lucide-vue-next';
import { ref, computed } from 'vue';

// Props
const props = defineProps<{
  data: { id: number; head: string; text: string, image: string }[];
}>();

// State
const currentIndex = ref(0);

// Computed Property for Current Tip
const currentTip = computed(() => props.data[currentIndex.value - 1]);

// Methods
const nextTip = () => {
  if (currentIndex.value < props.data.length) {
    currentIndex.value++;
  }
};

const previousTip = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
</script>

<style scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-sm\/6 {
  line-height: 1.6;
}
</style>