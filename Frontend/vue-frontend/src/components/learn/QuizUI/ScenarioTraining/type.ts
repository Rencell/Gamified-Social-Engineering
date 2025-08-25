export interface Story {
  type: 'story'
  title: string
  image?: string
  description: string[]
}


interface Option {
    id: string;
    text: string;

}

export interface MCQ {
  type: 'mcq'
  position: 'left' | 'right'
  question: string
  answer: string
  explanation?: string
  image?: string
  options: Option[]
}

export type ScenarioStep = Story | MCQ;
