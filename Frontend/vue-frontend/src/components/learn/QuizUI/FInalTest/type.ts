
export interface TwoImage {
    Question: string;
    type: 'two-image';
    image1: string;
    image2: string;
    answer?: 'image1' | 'image2';
    explanation: string
}

export interface MultipleChoice {
    image: string
    type: 'multiple-choice';
    question: string
    options: Array<{
        id: string;
        text: string;
    }>;
    correctAnswer: string
    explanation: string
}

export interface TrueFalse {
    image: string;
    question: string;
    type: 'true-false';
    answer: string;
    explanation: string;
}

export type Test = TwoImage | MultipleChoice | TrueFalse;