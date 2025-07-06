import { ref } from 'vue'
import { defineStore } from 'pinia'

import WhatPhishing from '@/views/Learn/Phishing/Modules/WhatPhishing.vue'
import EmailPhishing from '@/views/Learn/Phishing/Modules/EmailPhishing.vue'
import WebsitePhishing from '@/views/Learn/Phishing/Modules/WebsitePhishing.vue'
import SocialMediaPhishing from '@/views/Learn/Phishing/Modules/SocialMediaPhishing.vue'
import VoicePhishing from '@/views/Learn/Phishing/Modules/VoicePhishing.vue'
import SmsPhishing from '@/views/Learn/Phishing/Modules/SmsPhishing.vue'
import HowToProtect from '@/views/Learn/Phishing/Modules/HowToProtect.vue'
import Introduction from '@/views/Learn/Phishing/Modules/introduction.vue'

export interface Module {
  title: string
  routerLink: string
  interactive?: boolean
  component: object
}

export const useLearningStore = defineStore('learning', () => {
  const phishingModules = ref<Module[]>([
    {
      title: 'Introduction to Social Engineering',
      routerLink: 'phishing1',
      interactive: true,
      component: Introduction
    },
    { title: 'Email Phishing', routerLink: 'phishing1', component: EmailPhishing },
    { title: 'Website Phishing', routerLink: 'phishing1', component: WebsitePhishing },
    { title: 'Social Media Phishing', routerLink: 'phishing1', component: SocialMediaPhishing },
    { title: 'Voice Phishing', routerLink: 'phishing1', component: VoicePhishing },
    { title: 'SMS Phishing', routerLink: 'phishing1', component: SmsPhishing },
    { title: 'How to Protect Yourself', routerLink: 'phishing1', component: HowToProtect }
  ])

  const selectedModule = ref<Module>(phishingModules.value[0])

  function setSelectedModule(module: Module) {
    selectedModule.value = module
  }

  return { phishingModules, selectedModule, setSelectedModule }
})
