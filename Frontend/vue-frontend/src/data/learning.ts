import type { Lesson } from "@/stores/types/learning";

// Import all module components
import PhishingIntro from '@/components/learn/content/phishing/introduction.vue';
import EmailPhishing from '@/components/learn/content/phishing/EmailPhishing.vue'
import WebsitePhishing from '@/components/learn/content/phishing/WebsitePhishing.vue'
import SocialMediaPhishing from '@/components/learn/content/phishing/SocialMediaPhishing.vue'
import VoicePhishing from '@/components/learn/content/phishing/VoicePhishing.vue'
import SmsPhishing from '@/components/learn/content/phishing/SmsPhishing.vue'
import HowToProtect from '@/components/learn/content/phishing/HowToProtect.vue'

import WhatIsSocialEngineering from '@/components/learn/content/introToSocialEngineering/WhatIsSocialEngineering.vue';
import PsychologicalPrinciplesUsed from '@/components/learn/content/introToSocialEngineering/PsychologicalPrinciplesUsed.vue';
import PhishingAndSocialMediaAttacks from '@/components/learn/content/introToSocialEngineering/PhishingAndSocialMediaAttacks.vue';
import BaitingAndPretexting from '@/components/learn/content/introToSocialEngineering/BaitingAndPretexting.vue';
import TailgatingAndPhysicalBreaches from '@/components/learn/content/introToSocialEngineering/TailgatingAndPhysicalBreaches.vue';
import InteractiveScenarioSpotTheAttack from '@/components/learn/content/introToSocialEngineering/InteractiveScenarioSpotTheAttack.vue';
import HowToProtectYourselfSocialEngineering from '@/components/learn/content/introToSocialEngineering/HowToProtectYourself.vue';
import FinalQuiz from '@/components/learn/content/introToSocialEngineering/FinalQuiz.vue';

export const lessons: Record<string, Lesson> = {
    'introToSocialEngineering': {
        id: 'introToSocialEngineering', 
        title: 'Introduction to Social Engineering',
        description: 'Learn the basics of how social engineering works and how attackers manipulate people to gain access.',
        modules: [
            { title: 'What is Social Engineering?', component: WhatIsSocialEngineering, interactive: true },
            { title: 'Psychological Principles Used', component: PsychologicalPrinciplesUsed },
            { title: 'Phishing & Social Media Attacks', component: PhishingAndSocialMediaAttacks },
            { title: 'Baiting & Pretexting', component: BaitingAndPretexting },
            { title: 'Tailgating and Physical Breaches', component: TailgatingAndPhysicalBreaches },
            { title: 'Interactive Scenario: Spot the Attack', component: InteractiveScenarioSpotTheAttack },
            { title: 'How to Protect Yourself', component: HowToProtectYourselfSocialEngineering },
            { title: 'Final Quiz', component: FinalQuiz },
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