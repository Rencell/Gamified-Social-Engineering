import type { Lesson } from "@/stores/types/learning";

//IntroToSocEng
import { WhatIsSocialEngineering, PsychologicalPrinciplesUsed, CommonAttacks, InteractiveScenarioSpotTheAttack, HowToProtectYourself, FinalQuiz } from "@/components/learn/content/introToSocialEngineering";
//Phishing
import { Introduction, EmailPhishing, WebsitePhishing, SocialMediaPhishing, VoicePhishing, SmsPhishing, HowToProtect } from "@/components/learn/content/phishing";


export const lessons: Record<string, Lesson> = {
    'introToSocialEngineering': {
        id: 'introToSocialEngineering', 
        title: 'Introduction to Social Engineering',
        description: 'Learn the basics of how social engineering works and how attackers manipulate people to gain access.',
        modules: [
            { title: 'What is Social Engineering?', component: WhatIsSocialEngineering, interactive: true },
            { title: 'Psychological Principles Used', component: PsychologicalPrinciplesUsed },
            { title: 'Common Social Engineering Attacks', component: CommonAttacks },
            { title: 'Interactive Scenario: Spot the Attack', component: InteractiveScenarioSpotTheAttack },
            { title: 'How to Protect Yourself', component: HowToProtectYourself },
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