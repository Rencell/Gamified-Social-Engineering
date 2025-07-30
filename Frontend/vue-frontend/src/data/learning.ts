import type { Lesson } from "@/stores/types/learning";

import phishing from "/Phishing.webp?url";
import socialEngineering from "/SecurityAwarenessEssentials@3x.svg?url";
import human from "/Human.webp?url";

//IntroToSocEng
import { WhatIsSocialEngineering, PsychologicalPrinciplesUsed, CommonAttacks, InteractiveScenarioSpotTheAttack, HowToProtectYourself, FinalQuiz } from "@/components/learn/content/introToSocialEngineering";
//Phishing
import { Introduction, EmailPhishing, WebsitePhishing, SocialMediaPhishing, VoicePhishing, SmsPhishing, HowToProtect } from "@/components/learn/content/phishing";


export const lessons: Record<string, Lesson> = {
    'introToSocialEngineering': {
        id: 'introToSocialEngineering', 
        title: 'Introduction to Social Engineering',
        image: human,
        bg: 'bg-[#4f1c51]',
        locked: false,
        description: 'Learn the basics of how social engineering works and how attackers manipulate people to gain access.',
        
        modules: [
            { title: 'What is Social Engineering?', component: WhatIsSocialEngineering, interactive: false },
            { title: 'Psychological Principles Used', component: PsychologicalPrinciplesUsed, interactive: false },
            { title: 'Types of Social Engineering Attacks', component: CommonAttacks, interactive: false },
            { title: 'Interactive Scenario: Spot the Attack', component: InteractiveScenarioSpotTheAttack, interactive: false },
            { title: 'How to Protect Yourself', component: HowToProtectYourself, interactive: false },
            { title: 'Final Quiz', component: FinalQuiz },
        ]
    },
    'phishing': {
        id: 'phishing`', 
        title: 'Phishing',
        image: phishing,
        bg: 'bg-[#2E236C]',
        locked: true,
        description: 'Learn about phishing attacks, how to recognize them, and how to protect yourself.',
        modules: [
            {
                title: 'brombadilla',
                component: Introduction,
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