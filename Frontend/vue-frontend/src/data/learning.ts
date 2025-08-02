import type { Lesson } from "@/stores/types/learning";

import phishing from "/Phishing.webp?url";
import socialEngineering from "/SecurityAwarenessEssentials@3x.svg?url";
import human from "/Human.webp?url";
import { LessonService } from "@/services";
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
        lesson_order: 1,
        locked: false,
        description: 'Learn the basics of how social engineering works and how attackers manipulate people to gain access.',
        modules: [
            { id: 'whatIsSocialEngineering', title: 'What is Social Engineering?', component: WhatIsSocialEngineering, module_order: 1, interactive: false },
            { id: 'psychologicalPrinciplesUsed', title: 'Psychological Principles Used', component: PsychologicalPrinciplesUsed, module_order: 2, interactive: false },
            { id: 'typesOfSocialEngineeringAttacks', title: 'Types of Social Engineering Attacks', component: CommonAttacks, module_order: 3, interactive: false },
            { id: 'interactiveScenarioSpotTheAttack', title: 'Interactive Scenario: Spot the Attack', component: InteractiveScenarioSpotTheAttack, module_order: 4, interactive: false },
            { id: 'howToProtectYourself', title: 'How to Protect Yourself', component: HowToProtectYourself, module_order: 5, interactive: false },
            { id: 'finalQuiz', title: 'Final Quiz', component: FinalQuiz, module_order: 6 }
        ]
    },
    'phishing': {
        id: 'phishing',
        title: 'Phishing',
        image: phishing,
        bg: 'bg-[#2E236C]',
        lesson_order: 2,
        locked: true,
        description: 'Learn about phishing attacks, how to recognize them, and how to protect yourself.',
        modules: [
            { id: 'phishingIntro', title: 'phishingIntro', component: Introduction, module_order: 1, interactive: true },
            { id: 'phishing2', title: 'phishing2', component: EmailPhishing, module_order: 2, interactive: false },
            { id: 'websitePhishing', title: 'Website Phishing', component: WebsitePhishing, module_order: 3, interactive: false },
            { id: 'socialMediaPhishing', title: 'Social Media Phishing', component: SocialMediaPhishing, module_order: 4, interactive: false },
            { id: 'voicePhishing', title: 'Voice Phishing', component: VoicePhishing, module_order: 5, interactive: false },
            { id: 'smsPhishing', title: 'SMS Phishing', component: SmsPhishing, module_order: 6, interactive: false },
            { id: 'howToProtectYourself', title: 'How to Protect Yourself', component: HowToProtect, module_order: 7, interactive: false }
        ]
    }
};


