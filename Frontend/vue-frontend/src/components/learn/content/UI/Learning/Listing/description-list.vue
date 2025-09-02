<template>
  <div @click="showExample[index] = !showExample[index]"
    :class="showExample[index] ? '' : 'hover:scale-102'"
    class="flex flex-col gap-3 rounded-sm border-[0.5px] border-ternary/50 bg-secondary duration-100 ease-in hover:shadow-lg pb-5 cursor-pointer"
    v-for="(value, index) in props.data" :key="index">
    <div @click="showExample[index] = showExample[index]" class="flex items-center justify-between p-5 py-8">
      <div class="flex gap-4">
        <div class="box-content w-10 rounded-full bg-accent/50 p-2">
          <img class="w-fit" :src="value.image" alt="" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="font-secondary text-xl font-bold">{{ value.heading }}</p>
          <i class="text-sm">
            {{ value.subheading }}
          </i>
        </div>
      </div>

      <div class="text-center">
        <button @click="showExample[index] = showExample[index]"
          class="bg-accent rounded-full p-1 px-3 text-xs font-semibold text-white transition">
          <div v-if="!showExample[index]">
            Expand<i class="bi bi-arrow-down-short"></i>
          </div>
          <div v-else>Collapse<i class="bi bi-arrow-up-short"></i></div>
        </button>
      </div>
    </div>
    <div :class="{ 'animate': !showExample[index] }" class="motion-preset-slide-down px-23">
      <h1 class="font-secondary mb-4 text-xs font-semibold text-gray-400">
        WHAT IS THIS?
      </h1>
      <p class="font-secondary mb-7 text-sm/loose text-white-800">
        {{ value.description }}
      </p>

      <h1 class="font-secondary mb-4 text-xs font-semibold text-gray-400" v-if="value.examples && value.examples.length > 0">
        SOME OF EXAMPLE/S
      </h1>
      

      <description-examples v-for="(value2, index) in value.examples" 
        :key="index" 
        :index="index+ 1"
        :example=value2.example
        :image="value2.image" />
      <h1 class="font-secondary mb-4 text-xs font-semibold text-gray-400">
        TYPICAL SIGNS OF {{ value.heading.toUpperCase() }}
      </h1>
      <div class="font-secondary ms-4">
        <ul class="list-disc text-sm flex flex-col gap-2">

          <li v-for="(valueSign,index) in value.signs" :key="index">
            {{ valueSign }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import type { DescriptionData } from './type';
import { ref } from "vue";
import DescriptionExamples from './description-examples.vue'

const showExample = ref(<boolean[]>[false]);

const props = defineProps<{
  data: DescriptionData[];
}>();

</script>

<style scoped>

@keyframes fade-out {
  from {
    display: block;
    max-height: 1000px;
  }
  to {
    display: none;
    max-height: 0;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
}

.animate {
  animation: fade-out 0.2s ease-out forwards;
  overflow: hidden;
}
.animate > * {
  opacity: 0;
}

</style>
