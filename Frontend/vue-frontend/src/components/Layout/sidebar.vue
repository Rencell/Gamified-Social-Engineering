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
import malware from '/Icons/malware.svg?url'

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
    // Grouped Simulations as a subfolder
    {
      title: 'Simulation',
      Image: hook,
      children: [
        {
          title: 'Safe Browsing',
          url: '/safe-browsing',
          Image: malware
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
      ]
    },
  ],
}
const panelRef = ref<HTMLElement | null>(null)
const toggleFooter = ref(false)
const toggleFooterMenu = () => {
  toggleFooter.value = !toggleFooter.value
}

const simulationOpen = ref(false)
const toggleSimulation = () => {

  simulationOpen.value = !simulationOpen.value
}
// Track open/closed state per parent group (e.g., "Simulation")
const openGroups = ref<Record<string, boolean>>({})
const isGroupOpen = (title: string) => !!openGroups.value[title]
const toggleGroup = (title: string) => {
  openGroups.value[title] = !openGroups.value[title]
}

const handleClickOutside = (event: MouseEvent) => {
  if (panelRef.value && !panelRef.value.contains(event.target as Node)) {
    toggleFooter.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  // Auto-open Simulation if any of its children are active
  const sim = (navigationData.learning as any[]).find((i: any) => i.title === 'Simulation')
  if (sim && sim.children) {
    openGroups.value['Simulation'] = sim.children.some((c: any) => route.path.startsWith(c.url))
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="pr-3 bg-secondary rounded-3xl md:block hidden">
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
                <!-- Parent with children (Simulation group) -->
                <template v-if="item.children">
                  <!-- <SidebarGroupLabel class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                    Simulation
                  </SidebarGroupLabel> -->
                  <div class="flex items-center gap-3 ">
                    <SidebarMenuButton :data-active="item.children.some(child => route.path.startsWith(child.url))"
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
                        w-full flex items-center
                      " @click="toggleGroup(item.title)">

                      <img :src="item.Image" alt="" class="h-6 w-6 flex-shrink-0 me-3" />
                      <span class="font-bold ">{{ item.title }} </span>
                      <ChevronDown class="h-4 w-4 ml-auto transition-transform"
                        :class="{ 'rotate-180': isGroupOpen(item.title) }" />

                    </SidebarMenuButton>
                  </div>

                  <!-- Children links -->
                  <div v-show="isGroupOpen(item.title)" class="mt-2 pl-6 space-y-2 border-s-2 border-ternary">
                    <RouterLink v-for="child in item.children" :key="child.title" :to="child.url"
                      class="flex items-center gap-3 ">
                      <SidebarMenuButton :data-active="route.path.startsWith(child.url)" class="
                          cursor-pointer  
                          h-10 px-3 rounded-sm transition-all duration-200
                          text-slate-300 hover:text-white
                          hover:bg-accent/20
                          data-[active=true]:bg-accent/10
                          data-[active=true]:border-2
                          data-[active=true]:border-accent
                          data-[active=true]:text-white
                          data-[active=true]:shadow-sm
                        ">

                        <img :src="child.Image" alt="" class="h-5 w-5 flex-shrink-0 me-3" />
                        <span class="text-sm ">{{ child.title }} </span>

                      </SidebarMenuButton>
                    </RouterLink>
                  </div>
                </template>

                <!-- Regular single item -->
                <template v-else>
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
                </template>

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
          <Transition name="transition-up">
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
  </div>



  <div
    class="scroll-smooth overflow-x-auto fixed h-31 bottom-0 left-0 right-0 w-full z-20 text-white text-center md:hidden scrollbar-hide">

    <Transition name="transition-up">
      <div v-if="simulationOpen" @click="simulationOpen =false" class="absolute top-0 left-58 bg-background p-3 w-fit rounded-lg border border-slate-700">
        <div v-for="parent in navigationData.learning.filter(item => item.children)" :key="parent.title"
          class="flex gap-5">
  
          <RouterLink v-for="child in parent.children" :key="child.title" :to="child.url" class="flex items-center"
            :class="{
              'opacity-100': route.path.startsWith(child.url),
              'opacity-50': !route.path.startsWith(child.url)
            }">
            <img :src="child.Image" alt="" class="h-8 w-8 flex-shrink-0" />
          </RouterLink>
        </div>
      </div>
    </Transition>
    
    <div class="absolute bottom-0 flex flex-nowrap space-x-6 bg-secondary/50 backdrop-blur-lg p-4 w-auto  min-w-full">

      <!-- Flatten children for mobile nav -->
      <div v-for="item in navigationData.learning" :key="item.title">
        <template v-if="item.children">
          <div class="flex justify-center" @click="toggleSimulation">
            <img :src="item.Image" alt="" class="h-8 w-8 flex-shrink-0" />
          </div>
        </template>
        <template v-else>
          <RouterLink :to="Array.isArray(item.url) ? item.url[0] : item.url" class="flex items-center" @click="simulationOpen =false" :class="{
            'opacity-100': Array.isArray(item.url) ? item.url.some(path => route.path.startsWith(path)) : route.path.startsWith(item.url),
            'opacity-50': !(Array.isArray(item.url) ? item.url.some(path => route.path.startsWith(path)) : route.path.startsWith(item.url))
          }">
            <img :src="item.Image" alt="" class="h-8 w-8 flex-shrink-0" />
          </RouterLink>
        </template>
      </div>
      <div>
        <RouterLink :to="'/settings'" class="flex items-center" @click="simulationOpen =false" :class="{
          'opacity-100': route.path.startsWith('/settings'),
          'opacity-50': !route.path.startsWith('/settings')
        }">
          <img :src="profile" alt="" class="h-8 w-8 flex-shrink-0" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-smooth {
  scroll-behavior: smooth;
}


/* Named transition: transition-up */
.transition-up-enter-active {
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}
.transition-up-enter-from {
  transform: translateY(6px) scale(0.98);
  opacity: 0;
}
.transition-up-enter-to {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.transition-up-leave-active {
  transition: transform 150ms ease-in, opacity 150ms ease-in;
}
.transition-up-leave-from {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.transition-up-leave-to {
  transform: translateY(6px) scale(0.98);
  opacity: 0;
}
</style>
