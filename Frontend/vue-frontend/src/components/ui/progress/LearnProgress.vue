<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  ProgressIndicator,
  ProgressRoot,
  type ProgressRootProps,
} from 'reka-ui'
import { cn } from '@/lib/utils'
import { Trophy } from 'lucide-vue-next';

import book from '/Learning/book.png'
import { useLearningStore } from '@/stores/learning';

const props = withDefaults(
  defineProps<ProgressRootProps & {
    class?: HTMLAttributes['class'],
    tongueColor?: string,
    moduleCount?: number,
    isLatest?: boolean
    position: string
  }>(),
  {
    modelValue: 0,
    tongueColor: '#006f54',
    moduleCount: 0,
    position: ''
  },
)
const learningStore = useLearningStore();
const delegatedProps = reactiveOmit(props, 'class')
const UnlockedModules = computed(() => learningStore.latestModuleUnlockedCount);

const bg = 'bg-violet-500'
</script>

<template>

  <div class="flex relative items-center">
    <ProgressRoot data-slot="progress" v-bind="delegatedProps" :class="cn(
      'relative h-6 w-full rounded-full overflow-hidden shadow-2xl bg-black/30',
      props.class,
    )
      ">

      <ProgressIndicator data-slot="progress-indicator"
        class="h-full w-full flex-1  transition-all rounded-full relative"
        :class="bg"
        :style="`transform: translateX(-${100 - (UnlockedModules  / moduleCount) * 100}%);`">
      
      
        <div class="brightness-120 absolute rounded-full top-1.5 h-1.5 right-2  inset-0 ms-auto"
        :class="bg"
        :style="{ width: `calc(${(UnlockedModules / moduleCount) * 100}% - 1rem)` }"></div>
      </ProgressIndicator>


      <div class="text-sm absolute top-0 w-full font-bold text-primary text-center">
        {{ UnlockedModules  }} / {{ moduleCount }}
      </div>
    </ProgressRoot>
    <div :class="[position === 'left' ? '-right-5' : '-left-5']"
      :style="{ backgroundColor: props.tongueColor}"
      class="absolute size-10  rounded-full flex justify-center items-center">

      <img :src="book" alt="">
    </div>

  </div>



</template>
