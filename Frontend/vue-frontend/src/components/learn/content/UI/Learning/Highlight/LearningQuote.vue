<template>
  <div :class="quoteVariants({ variant })">
    <div class="flex items-center gap-5">
      <div :class="iconContainerVariants({ variant })">
        <Info v-if="variant === 'default'" :class="cn(iconVariants({ variant }))" />
        <Lightbulb v-if="variant === 'info'" :class="cn(iconVariants({ variant }))" />
        <AlertTriangle v-if="variant === 'danger'" :class="cn(iconVariants({ variant }))" />

      </div>
      <p :class="titleVariants({ variant })">{{ title }}</p>
    </div>
    <div class="w-xl ps-15 font-medium">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Info, Lightbulb, AlertTriangle } from 'lucide-vue-next';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const props = withDefaults(defineProps<{
  variant?: 'default' | 'info' | 'danger';
}>(), {
  variant: 'default',
});


const title = computed(() => {
  switch (props.variant) {
    case 'info':
      return 'Info';
    case 'danger':
      return 'Danger';
    default:
      return 'Remember';
  }
});

const quoteVariants = cva(
  'p-4 border-2 rounded-lg shadow-md',
  {
    variants: {
      variant: {
        default: 'bg-green-900/20 text-slate-300 border-green-500/40',
        info: 'bg-blue-900/20 text-slate-300 border-blue-500/40',
        danger: 'bg-red-900/20 text-slate-300 border-red-500/40',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const iconContainerVariants = cva(
  'rounded-lg p-2 w-fit self-start',
  {
    variants: {
      variant: {
        default: 'bg-green-500/40',
        info: 'bg-blue-500/40',
        danger: 'bg-red-500/40',
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const iconVariants = cva(
  '',
  {
    variants: {
      variant: {
        default: 'text-green-500',
        info: 'text-blue-500',
        danger: 'text-red-500',
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const titleVariants = cva(
  'text-lg font-bold mb-5',
  {
    variants: {
      variant: {
        default: 'text-green-500',
        info: 'text-blue-500',
        danger: 'text-red-500',
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

</script>