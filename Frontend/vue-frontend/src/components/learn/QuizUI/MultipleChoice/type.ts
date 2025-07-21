export interface Question{
    image: string
    question: string
    options: Array<{
        id: string;
        text: string;
    }>;
    correctAnswer: string
    explanation: string
}