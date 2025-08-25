<script setup lang="ts">
import { RouterView } from 'vue-router'
import sidebar from './components/Layout/sidebar.vue';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue';
import { Toaster } from '@/components/ui/sonner'
import { useLoadingPageStore } from './stores/pageLoading';
import { Spinner } from './components/ui/spinner';
import { useAuthStore } from '@/stores/auth'
import 'vue-sonner/style.css'

const route = useRoute()
const authStore = useAuthStore()
const isFullscreen = computed(() => route.meta.layout === 'fullscreen')

onMounted(async() => {
  authStore.init()
})
</script>

<template>
  <Toaster />
  <div v-if="useLoadingPageStore().isLoading">
   
    <div class="fixed inset-0 flex items-center justify-center bg-black/70 z-50 flex-col gap-4">
      
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
