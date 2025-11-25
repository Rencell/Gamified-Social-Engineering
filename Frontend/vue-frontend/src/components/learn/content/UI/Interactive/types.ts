
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

export interface TooltipData {
    id: string
    title: string
    description: string
    x: number
    y: number
    position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
}