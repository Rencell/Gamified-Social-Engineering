<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

import { computed, onMounted,ref } from 'vue'

import home from '/public/Icons/Home.svg?url'
import learn from '/public/Icons/Learn.svg?url'
import learns from '/public/Icons/Learns.svg?url'
import trophy from '/public/Icons/Trophy.svg?url'
import { Home, BookOpen, Trophy, AlertTriangle, User, Flag } from 'lucide-vue-next'
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
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const route = useRoute()
const pathname = computed(() => route.path)

const navigationData = {
  learning: [
    {
      title: 'Home', 
      url: '/home',
      icon: Home,
      Image: home
    },
    { 
      title: 'Learn', 
      url: '/learn', 
      icon: BookOpen,
      Image: learn
    },
    { 
      title: 'Leaderboards', 
      url: '#', 
      icon: Trophy ,
      Image: trophy
    },
  ],
  account: [
    { title: 'Data Breaches', url: '#', icon: AlertTriangle, variant: 'destructive' },
    { title: 'Profile', url: '#', icon: User },
  ],
}


onMounted(()=> {
  console.log(pathname)
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
          <SidebarMenu class="space-y-1">
            <SidebarMenuItem v-for="item in navigationData.learning" :key="item.title">
              <RouterLink :to="item.url" class="flex items-center gap-3">
              <SidebarMenuButton :data-active="route.path.startsWith(item.url)" class="
                  h-11 px-3 rounded-sm transition-all duration-200
                  text-slate-300 hover:text-white
                  hover:bg-slate-700/50
                  data-[active=true]:bg-slate-800
                  data-[active=true]:border-1
                  data-[active=true]:border-slate-600
                  data-[active=true]:text-white
                  data-[active=true]:shadow-sm
                ">
                  <img :src="item.Image" alt="" class="h-6 w-6 flex-shrink-0" />
                  <!-- <component :is="item.icon" class="h-5 w-5 flex-shrink-0" /> -->
                  <span class="font-bold">{{ item.title }} </span>
                  
                </SidebarMenuButton>
              </RouterLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Account Section -->
      <SidebarGroup class="mt-8">
        <SidebarGroupLabel class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
          Account
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu class="space-y-1">
            <SidebarMenuItem v-for="item in navigationData.account" :key="item.title">
              <SidebarMenuButton class="
                  h-11 px-3 rounded-lg transition-all duration-200
                  text-slate-300 hover:text-white
                  hover:bg-slate-700/50
                  " :class="item.variant === 'destructive' ? 'hover:bg-red-900/20 hover:text-red-400' : ''">
                <a :href="item.url" class="flex items-center gap-3">
                  <component :is="item.icon" class="h-5 w-5 flex-shrink-0"
                    :class="item.variant === 'destructive' ? 'text-red-400' : ''" />
                  <span class="font-medium">{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter class="p-4 border-t border-slate-700">

      <div class="mt-4 pt-3 border-slate-700">
        <div class="flex items-center gap-2 text-sm text-slate-300">
          <User class="h-4 w-4" />
          <span>475eastern@edmy.net</span>
        </div>
      </div>
    </SidebarFooter>

    <SidebarRail />


  </Sidebar>
</template>
