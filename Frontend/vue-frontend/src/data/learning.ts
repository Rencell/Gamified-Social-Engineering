import type { Lesson } from '@/stores/types/learning'

import phishing from '/Phishing.webp?url'
import human from '/Human.webp?url'
//IntroToSocEng
import {
  WhatIsSocialEngineering,
  TheArtOfManipulation,
  CommonAttacks,
  InteractiveScenarioSpotTheAttack,
  HowToProtectYourself,
  FinalQuiz,
} from '@/components/learn/content/introToSocialEngineering'
//Phishing
import {
  RedFlags,
  WhatIsPhishing,
  RealWorldExamples,
  HowToProtect,
  FinalQuizPhishing,
} from '@/components/learn/content/phishing'
import { markRaw } from 'vue'

export const lessons: Record<string, Lesson> = {
  introToSocialEngineering: {
    id: 'introToSocialEngineering',
    title: 'The Social Engineering',
    image: human,
    bg: '#4f1c51',
    lesson_order: 1,
    locked: false,
    description:
      'Learn the basics of how social engineering works and how attackers manipulate people to gain access.',
    modules: [
      {
        id: 'whatIsSocialEngineering',
        title: 'What is Social Engineering?',
        component: markRaw(WhatIsSocialEngineering), // Wrapped with markRaw
        module_order: 1,
        unlocksLessonId: 1,
        interactive: false,
      },
      {
        id: 'psychologicalPrinciplesUsed',
        title: 'The Art of Manipulation',
        component: markRaw(TheArtOfManipulation), // Wrapped with markRaw
        module_order: 2,
        unlocksLessonId: 1,
        interactive: false,
      },
      {
        id: 'typesOfSocialEngineeringAttacks',
        title: 'Types of Social Engineering Attacks',
        component: markRaw(CommonAttacks), // Wrapped with markRaw
        module_order: 3,
        unlocksLessonId: 1,
        interactive: false,
      },
      {
        id: 'interactiveScenarioSpotTheAttack',
        title: 'Interactive Scenario: Spot the Attack',
        component: markRaw(InteractiveScenarioSpotTheAttack), // Wrapped with markRaw
        module_order: 4,
        unlocksLessonId: 1,
        interactive: false,
      },
      {
        id: 'howToProtectYourself',
        title: 'How to Protect Yourself',
        component: markRaw(HowToProtectYourself), // Wrapped with markRaw
        module_order: 5,
        unlocksLessonId: 1,
        interactive: false,
      },
      {
        id: 'finalQuiz',
        title: 'Final Quiz',
        component: markRaw(FinalQuiz), // Wrapped with markRaw
        module_order: 6,
        unlocksLessonId: 2,
        interactive: false,
        final: true,
      },
    ],
  },
  phishing: {
    id: 'phishing',
    title: 'Phishing',
    image: phishing,
    bg: '#2E236C',
    lesson_order: 2,
    locked: true,
    description:
      'Learn about phishing attacks, how to recognize them, and how to protect yourself.',
    modules: [
      {
        id: 'phishingIntro',
        title: 'What is phishing',
        component: markRaw(WhatIsPhishing),
        module_order: 7,
        unlocksLessonId: 2,
        interactive: false,
      },
      {
        id: 'redFlags',
        title: 'Red Flags of Phishing',
        component: markRaw(RedFlags), 
        module_order: 8,
        unlocksLessonId: 2,
        interactive: false,
      },
      {
        id: 'realWorldExamples',
        title: 'Real World Examples',
        component: markRaw(RealWorldExamples), // Wrapped with markRaw
        module_order: 9,
        unlocksLessonId: 2,
        interactive: false,
      },
      {
        id: 'HowToProtect',
        title: 'Protect from Phishing',
        component: markRaw(HowToProtect), // Wrapped with markRaw
        module_order: 10,
        unlocksLessonId: 2,
        interactive: false,
      },
      {
        id: 'FinalModulePhishing',
        title: 'Final Quiz',
        component: markRaw(FinalQuizPhishing), // Wrapped with markRaw
        module_order: 11,
        unlocksLessonId: 2,
        interactive: false,
        final: true,
      },
    ],
  },
};
