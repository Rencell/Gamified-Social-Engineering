import type { Lesson } from "@/stores/types/learning";

// Import all module components
import PhishingIntro from '@/components/learn/content/phishing/introduction.vue';
import EmailPhishing from '@/components/learn/content/phishing/EmailPhishing.vue'
import WebsitePhishing from '@/components/learn/content/phishing/WebsitePhishing.vue'
import SocialMediaPhishing from '@/components/learn/content/phishing/SocialMediaPhishing.vue'
import VoicePhishing from '@/components/learn/content/phishing/VoicePhishing.vue'
import SmsPhishing from '@/components/learn/content/phishing/SmsPhishing.vue'
import HowToProtect from '@/components/learn/content/phishing/HowToProtect.vue'

export const lessons: Record<string, Lesson> = {
    'phishing': {
        id: 'phishing', 
        title: 'Phishing',
        description: 'Learn about phishing attacks, how to recognize them, and how to protect yourself.',
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
    'bayag': {
        id: 'bayag`', 
        title: 'bayag',
        description: 'Learn about phishing attacks, how to recognize them, and how to protect yourself.',
        modules: [
            {
                title: 'brombadilla',
                component: PhishingIntro,
                interactive: true,
            },
            { title: 'crocodilla    ', component: EmailPhishing },
            { title: 'Website Phishing', component: WebsitePhishing },
            { title: 'Social Media Phishing', component: SocialMediaPhishing },
            { title: 'Voice Phishing', component: VoicePhishing },
            { title: 'SMS Phishing', component: SmsPhishing },
            { title: 'How to Protect Yourself', component: HowToProtect }
        ]
    },
};