
export interface Option {
    id: string;
    text: string;
}

export interface MCQ {
    question: string;
    options: Option[];
    correctAnswer: string;
}

export interface FlippingCardData {
    front: string;
    back: string;
}