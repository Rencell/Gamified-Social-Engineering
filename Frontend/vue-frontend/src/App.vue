<script setup lang="ts">
import { RouterView } from 'vue-router'
import sidebar from './components/Layout/sidebar.vue';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { useRoute } from 'vue-router'
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { Toaster } from '@/components/ui/sonner'
import { useLoadingPageStore } from './stores/pageLoading';
import { Spinner } from './components/ui/spinner';
import { useAuthStore } from '@/stores/auth'
import { useStreakStore } from '@/stores/pageStreak';
import { useCourseUnlockStore } from './stores/pageCourseUnlock';
import 'vue-sonner/style.css'
import DayStreak from './components/achievement/DayStreak.vue'
import CourseUnlock from './components/achievement/CourseUnlock.vue'
import { useLessonStore } from './stores/lesson';

const streakStore = useStreakStore()
const route = useRoute()
const authStore = useAuthStore()
const courseUnlockStore = useCourseUnlockStore()
const isFullscreen = computed(() => route.meta.layout === 'fullscreen')

const initialized = ref(false);
onMounted(async() => {
  authStore.init()
  initialized.value = true; 
})

const sht = ref(false)


</script>

<template>
  
  <Toaster />
<CourseUnlock :is-open="courseUnlockStore.openCourseModal" :onClose="courseUnlockStore.closeStreakModal" />
  <DayStreak :is-open="streakStore.openStreakModal" :onClose="streakStore.closeStreakModal"/>
  <div v-if="useLoadingPageStore().isLoading">
    <div class="fixed inset-0 flex items-center justify-center bg-black/70 z-99 flex-col gap-4">
      
      <Spinner size="lg" variant="white">

      </Spinner>
      <div>Loading ...</div>
    </div>
  </div>
  <div v-if="isFullscreen">
    <RouterView />
  </div>

  
  <div v-else>
    <SidebarProvider class="h-screen flex">
      <sidebar />
      <main class="flex-1 overflow-y-auto scroll-hidden">
        <SidebarInset>
          <div class="md:p-10 p-2 pt-9 mb-20 sm:mb-0" >
            <RouterView />

          </div>
        </SidebarInset>
      </main>
    </SidebarProvider>
  </div>
</template>

<style scoped>

.scroll-hidden::-webkit-scrollbar {
  display: none;
}

.scroll-hidden {
  -ms-overflow-style: none;
  /* IE/Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>
