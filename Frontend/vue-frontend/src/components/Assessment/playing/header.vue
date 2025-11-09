<script setup lang="ts">
import { Clock, X } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import SectionProgress from '@/components/ui/progress/SectionProgress.vue'
import Progress from '@/components/ui/progress/Progress.vue'

const router = useRouter();

const goBack = () => {
  router.back();
};

const openRules = () => {
  // Add your rules modal logic here
  console.log('Opening rules');
};

const openFAQs = () => {
  // Add your FAQs navigation logic here
  console.log('Opening FAQs');
};
</script>

<template>
    <header>
        <div class="flex justify-center gap-5 px-8 py-8 bg-background">
            <div class="w-4xl flex justify-between gap-5">
              <button @click="goBack" class="text-slate-400 hover:text-slate-300 transition">
                  <X :size="24" />
              </button>
  
              <Progress :model-value="20" />
              <div class="flex gap-3">
                  <div class="flex items-center text-ternary gap-2">
                      <Clock />
                      <span class="ml-1 font-bold">15:00</span>
                  </div>
              </div>
            </div>
        </div>
    </header>
</template>