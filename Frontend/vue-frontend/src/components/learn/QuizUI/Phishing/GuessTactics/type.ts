export interface Option {
    id: string;
    text: string;
}

export interface Tactic {
    type: string;
    sender: string;
    subject: string;
    date: string;
    link: string;
    content: string[];
    options: Option[];
    correctAnswer: string;
}
