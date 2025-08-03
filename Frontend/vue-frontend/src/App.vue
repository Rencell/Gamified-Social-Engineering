<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import sidebar from './components/Layout/sidebar.vue';
import { Home, BookOpen, Trophy, AlertTriangle, User, Flag, ChevronRight } from 'lucide-vue-next'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import LearnView from './views/LearnView.vue';

import { useRoute } from 'vue-router'
import { computed, onBeforeMount, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

const route = useRoute()

const isFullscreen = computed(() => route.meta.layout === 'fullscreen')



</script>

<template>


  <div v-if="isFullscreen">
    
    
    <RouterView />
  </div>


  <div v-else>
    <SidebarProvider class="h-screen flex">
      <sidebar />
      <main class="flex-1 overflow-y-auto">

        <SidebarInset>



          <div class="md:p-10  p-2 pt-9">
            <RouterView />
          </div>
        </SidebarInset>
      </main>
    </SidebarProvider>
  </div>




</template>

<style scoped></style>
