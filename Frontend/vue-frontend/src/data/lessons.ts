
import type { Lesson } from '@/stores/types/learning';

// Import all module components
import PhishingIntro from '@/views/Learn/Phishing/Modules/introduction.vue';
import EmailPhishing from '@/views/Learn/Phishing/Modules/EmailPhishing.vue'
import WebsitePhishing from '@/views/Learn/Phishing/Modules/WebsitePhishing.vue'
import SocialMediaPhishing from '@/views/Learn/Phishing/Modules/SocialMediaPhishing.vue'
import VoicePhishing from '@/views/Learn/Phishing/Modules/VoicePhishing.vue'
import SmsPhishing from '@/views/Learn/Phishing/Modules/SmsPhishing.vue'
import HowToProtect from '@/views/Learn/Phishing/Modules/HowToProtect.vue'

export const lessons: Record<string, Lesson> = {
  'phishing': {
    id: 'phishing',
    title: 'Phishing Awareness',
    description: 'Learn to identify and protect yourself from phishing attacks.',
    modules: [
        {
            title: 'Introduction to Social Engineering',
            component: PhishingIntro,
            interactive: true,
        },
        { title: 'Email Phishing', component: EmailPhishing },
        { title: 'Website Phishing', component: WebsitePhishing },
        { title: 'Social Media Phishing', component: SocialMediaPhishing },
        { title: 'Voice Phishing', component: VoicePhishing },
        { title: 'SMS Phishing', component: SmsPhishing },
        { title: 'How to Protect Yourself', component: HowToProtect }
    ]
  },
  'password-security': {
    id: 'password-security',
    title: 'Password Security',
    description: 'Master the art of creating and managing strong passwords.',
    modules: [
    ]
  }
};
