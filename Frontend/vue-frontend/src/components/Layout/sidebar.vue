<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import home from '/Icons/Home.svg?url'
import learn from '/Icons/Learn.svg?url'
import trophy from '/Icons/Trophy.svg?url'
import game from '/Icons/Game.svg?url'
import profile from '/Icons/profile.svg?url'
import hook from '/Icons/hook.svg?url'
import sms from '/Icons/SMS.svg?url'
import assessment from '/Icons/assess.svg?url'


import logout from '/sidebar/door.svg'

import { User, ChevronDown } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore();

const route = useRoute()

const navigationData = {
  learning: [
    {
      title: 'Home',
      url: ['/home', '/shop', '/badge', '/profile'],
      Image: home
    },
    {
      title: 'Learn',
      url: '/learn',
      Image: learn
    },
    {
      title: 'Leaderboards',
      url: '/leaderboard',
      Image: trophy
    },
    {
      title: 'Mini Games',
      url: '/minigames',
      Image: game
    },
    {
      title: 'Assessments',
      url: '/assessments',
      Image: assessment
    },
    {
      title: 'Phishing Simulation',
      url: '/simulation',
      Image: hook
    },
    {
      title: 'Smishing Simulation',
      url: '/sms-simulation',
      Image: sms
    },
  ],
}
const panelRef = ref<HTMLElement | null>(null)
const toggleFooter = ref(false)
const toggleFooterMenu = () => {
  toggleFooter.value = !toggleFooter.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (panelRef.value && !panelRef.value.contains(event.target as Node)) {
    toggleFooter.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <Sidebar class="border-r-0 relative">

    <SidebarHeader class="p-4">
    </SidebarHeader>

    <SidebarContent class="px-3">
      <SidebarGroup>
        <SidebarGroupLabel class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
          Learning
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu class="space-y-3">
            <SidebarMenuItem v-for="item in navigationData.learning" :key="item.title">

              

              <RouterLink :to="Array.isArray(item.url) ? item.url[0] : item.url" class="flex items-center gap-3 ">
                <SidebarMenuButton
                  :data-active="Array.isArray(item.url) ? item.url.some(path => route.path.startsWith(path)) : route.path.startsWith(item.url)"
                  class="
                  cursor-pointer  
                  h-11 px-3 rounded-sm transition-all duration-200
                  text-slate-300 hover:text-white
                  hover:bg-accent/20
                  data-[active=true]:bg-accent/10
                  data-[active=true]:border-2
                  data-[active=true]:border-accent
                  data-[active=true]:text-white
                  data-[active=true]:shadow-sm
                ">
                  
                <img :src="item.Image" alt="" class="h-6 w-6 flex-shrink-0 me-3" />
                  <!-- <component :is="item.icon" class="h-5 w-5 flex-shrink-0" /> -->
                  <span class="font-bold ">{{ item.title }} </span>

                </SidebarMenuButton>
              </RouterLink>
              <p v-if="item.title === 'Assessments'" class="text-xs font-medium text-slate-400 uppercase tracking-wider mt-3">Simulation</p>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Account Section -->
    </SidebarContent>

    <SidebarFooter class="p-4 border-t border-slate-700">

      <div class="relative flex items-center justify-between rounded-lg border-1 border-ternary">
        <div class="p-3 rounded-lg w-full flex items-center justify-between hover:bg-background cursor-pointer"
          @click="toggleFooterMenu" ref="panelRef">
          <div class="flex items-center gap-2 text-sm text-slate-300">
            <User class="h-7 w-7 text-ternary" />
            <span class="text-xs">{{ authStore.User.username }}</span>
          </div>
          <div>
            <ChevronDown class="w-5 h-5"></ChevronDown>
          </div>
        </div>
        <Transition enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150" leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95">
          <div v-if="toggleFooter"
            class="w-full h-fit bg-background/80 backdrop-blur-lg border border-slate-700 rounded-lg absolute bottom-15 left-0 right-0 mt-4 shadow-lg">

            <RouterLink :to="{ name: 'logout' }"
              class="flex items-center gap-2 my-3 p-2 text-sm text-slate-300 hover:bg-accent hover:text-white cursor-pointer">
              <img :src="logout" alt="" class="h-7"> Sign Out
            </RouterLink>
          </div>
        </Transition>
      </div>

    </SidebarFooter>

    <!-- <SidebarRail /> -->


  </Sidebar>

  <div class="bg-secondary/50 backdrop-blur-lg absolute bottom-0 w-full p-4 z-20 text-white text-center md:hidden flex justify-between">
    <div v-for="item in navigationData.learning" :key="item.title">
      <RouterLink 
        :to="Array.isArray(item.url) ? item.url[0] : item.url" 
        class="flex items-center"
        :class="{
          'opacity-100': Array.isArray(item.url) ? item.url.some(path => route.path.startsWith(path)) : route.path.startsWith(item.url),
          'opacity-50': !(Array.isArray(item.url) ? item.url.some(path => route.path.startsWith(path)) : route.path.startsWith(item.url))
        }"
      >
        <img :src="item.Image" alt="" class="h-8 w-8 flex-shrink-0" />
      </RouterLink>
    </div>
    <div>
      <RouterLink 
        :to="'/settings'" 
        class="flex items-center"
        :class="{
          'opacity-100': route.path.startsWith('/settings'),
          'opacity-50': !route.path.startsWith('/settings')
        }"
      >
        <img :src="profile" alt="" class="h-8 w-8 flex-shrink-0" />
      </RouterLink>
    </div>
  </div>
</template>
