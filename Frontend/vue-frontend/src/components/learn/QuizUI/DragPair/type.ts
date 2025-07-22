export interface Question {
    id: number
    question: string
    topAnswer: string
    bottomAnswer: string
    correctAnswer: "top" | "bottom"
    feedback?: string
}