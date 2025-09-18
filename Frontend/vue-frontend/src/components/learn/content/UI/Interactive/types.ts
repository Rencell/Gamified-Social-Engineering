
export interface Option {
    id: string;
    text: string;
}

export interface MCQ {
    question: string;
    options: Option[];
    answer: string;
}

export interface FlippingCardData {
    front: string;
    back: string;
}