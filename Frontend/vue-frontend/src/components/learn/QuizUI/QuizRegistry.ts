import MultipleChoice from './MultipleChoice/MultipleChoice.vue'
import MatchingType from './MatchingType/matchingType.vue'
import DragPair from './DragPair/DragPair.vue'
import DoDont from './DoDont/DoDont.vue'
import ModuleReward from '../rewardUI/moduleReward.vue'
import FinalTest from './FInalTest/FinalTest.vue'
import ScenarioTraining from './ScenarioTraining/scenarioPlayer.vue'
import PhishingTactics from './Phishing/GuessTactics/PhishingTactics.vue'
import { defineAsyncComponent, type Component } from 'vue'

// Type Definition for Learning Components
export type QuizType = 'MultipleChoice' | 'MatchingType' | 'DragPair' | 'DoDont' | 'PhishingTactics' | 'ModuleReward' | 'ScenarioTraining' | 'FinalTest'
// Component Map
export const componentMap: Record<QuizType, Component> = {
  MultipleChoice,
  MatchingType,
  DragPair,
  DoDont,
  PhishingTactics,
  ModuleReward,
  FinalTest,
  ScenarioTraining
}

export const editableComponentMap: Record<QuizType, Component> = {
  MultipleChoice: defineAsyncComponent(
    () => import('./MultipleChoice/Editable.vue'),
  ),
  MatchingType: defineAsyncComponent(
    () => import('./MatchingType/editable.vue'),
  ),
  DragPair: defineAsyncComponent(() => import('./DragPair/editable.vue')),
  DoDont: defineAsyncComponent(() => import('./DoDont/editable.vue')),
  PhishingTactics: defineAsyncComponent(() => import('./Phishing/GuessTactics/editable.vue')),
  ModuleReward: defineAsyncComponent(() => import('../rewardUI/editable.vue')),
  FinalTest: defineAsyncComponent(() => import('../FinalSummaryUI/Editable/editable.vue')),
  ScenarioTraining: defineAsyncComponent(() => import('./ScenarioTraining/editable.vue')),
}

export type DefaultProps = {
  MultipleChoice: {
    image: string
    question: string
    options: { id: string; text: string }[]
    correctAnswer: string
    explanation: string
  }
  MatchingType: {
    match_A: string
    match_B: string
  }
  DragPair: {
    question: string
    topAnswer: string
    bottomAnswer: string
    correctAnswer: "top" | "bottom"
    feedback?: string
  }
  DoDont: {
    text: string;
    answer: 0 | 1;
  },
  PhishingTactics: {
      type: string;
      sender: string;
      subject: string;
      date: string;
      link: string;
      content: string[];
      options: { id: string; text: string }[];
      correctAnswer: string;
  }

  ModuleReward: Record<string, never>
  ScenarioTraining: ScenarioProps
  FinalTest: FinalTestProps
}

export type ScenarioProps = {
  MCQ: {
    type: 'mcq'
    position: 'left' | 'right'
    question: string
    answer: string
    explanation?: string
    image?: string
    options: { id: string; text: string }[]
  }

  Story: {
    type: 'story'
    title: string
    image?: string
    description: string[]
  }
}

export const defaultScenarioProps : ScenarioProps = {
  MCQ: {
    type: 'mcq',
    position: 'left',
    question: 'Your question here',
    answer: 'Correct Answer',
    explanation: 'Explanation for the answer',
    image: '',
    options: [
      { id: 'a', text: '' },
      { id: 'b', text: '' },
    ],
  },
  Story: {
    type: 'story',
    title: 'Your Story Title',
    image: '',
    description: ['Your story description here.'],
  },
}

export type FinalTestProps = {
  TrueFalse: {
    type: 'true-false';
    image?: string
    question: string
    answer: "True" | "False"
    explanation: string
  }
  MultipleChoice: {
    type: 'multiple-choice';
    image?: string
    question: string
    options: { id: string; text: string }[]
    correctAnswer: string
    explanation: string
  }
  TwoImage: {
    type: 'two-image';
    Question: string
    image1: string
    image2: string
    answer: "image1" | "image2"
    explanation: string
  }
}

export const defaultFinalTestProps: FinalTestProps = {
  TrueFalse: {
    type: 'true-false',
    image: '',
    question: 'Your question here',
    answer: "True",
    explanation: '',
  },
  MultipleChoice: {
    type: 'multiple-choice',
    image: '',
    question: 'Your question here',
    options: [
      { id: 'a', text: '' },
      { id: 'b', text: '' },
    ],
    correctAnswer: '',
    explanation: '',
  },
  TwoImage: {
    type: 'two-image',
    Question: 'Your question here',
    image1: '',
    image2: '',
    answer: "image1",
    explanation: '',
  },
}


export const defaultPropsMap: DefaultProps = {
  MultipleChoice: {
    question: '',
    image: '',
    options: [
      { id: 'a', text: '' },
      { id: 'b', text: '' },
    ],
    correctAnswer: '',
    explanation: '',
  },
  MatchingType: { match_A: 'option A', match_B: 'option B' },
  DragPair: {
    question: 'Question',
    topAnswer: '',
    bottomAnswer: '',
    correctAnswer: "top",
    feedback: '',
  },
  DoDont: {
    text: 'Your statement here',
    answer: 0,
  },
  PhishingTactics:{
    type: "email",
    sender: "rewards@amazn-survey.com",
    subject: "Congratulations! You have Been Selected for a $500 Amazon Gift Card",
    date: "Yesterday, 3:45 PM",
    link: "http://amazn-survey.com/survey",
    content: [
      "Congratulations!",
      "You have been randomly selected to participate in our quick customer satisfaction survey.",
      "Complete our 30-second survey and receive a $500 Amazon gift card absolutely FREE! No purchase necessary.",
      "We only have 10 gift cards remaining, so act fast!",
      "#Take Survey Now",
      "Amazon Customer Rewards Team"
    ],
    options: [
    { id: 'A', text: 'Sense of urgency' },
    { id: 'B', text: 'Authority Impersonation' },
    { id: 'C', text: 'Too Good To Be True Rewards' },
    { id: 'D', text: 'Not Phishing' },
    ],
    correctAnswer: "A",
  },
  ModuleReward: { },
  ScenarioTraining: defaultScenarioProps,
  FinalTest: defaultFinalTestProps,
}
